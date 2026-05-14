"use client";
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import { PACKAGE_GEO_DATA, getDayStops } from "@/data/itinerary-geo";

import routesPackage0 from "@/data/routes/package-0-routes.json";
import routesPackage1 from "@/data/routes/package-1-routes.json";
import routesPackage2 from "@/data/routes/package-2-routes.json";
import type { RouteSegment, DayRoute, PackageRoutes } from "@/types/routes";

const ALL_ROUTES: Record<number, PackageRoutes> = {
  0: routesPackage0 as PackageRoutes,
  1: routesPackage1 as PackageRoutes,
  2: routesPackage2 as PackageRoutes,
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export interface MapViewHandle {
  flyToDay: (dayIndex: number) => void;
  playAnimation: (dayIndex: number) => void;
  pauseAnimation: () => void;
}

interface MapViewProps {
  packageIndex: number;
  activeDayIndex: number;
  onAnimationEnd: () => void;
  onStopReached?: (stopIndex: number) => void;
}

/** Interpolate extra points along a straight line so sea segments animate smoothly */
function interpolateSeaCoords(coords: [number, number][], pointCount: number = 200): [number, number][] {
  if (coords.length < 2) return coords;
  const result: [number, number][] = [];
  for (let i = 0; i < coords.length - 1; i++) {
    const [lng1, lat1] = coords[i];
    const [lng2, lat2] = coords[i + 1];
    for (let j = 0; j < pointCount; j++) {
      const t = j / pointCount;
      result.push([lng1 + (lng2 - lng1) * t, lat1 + (lat2 - lat1) * t]);
    }
  }
  result.push(coords[coords.length - 1]);
  return result;
}

/** Calculate distance between two coordinates */
function coordDist(a: [number, number], b: [number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(({ packageIndex, activeDayIndex, onAnimationEnd, onStopReached }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const movingMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layerIdsRef = useRef<string[]>([]);
  const sourceIdsRef = useRef<string[]>([]);

  const pkgData = PACKAGE_GEO_DATA.find((p) => p.packageIndex === packageIndex);
  const routesData = ALL_ROUTES[packageIndex] || null;

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || !pkgData) return;

    const initTimer = setTimeout(() => {
      if (!mapContainer.current) return;
      const { offsetWidth, offsetHeight } = mapContainer.current;
      if (offsetWidth === 0 || offsetHeight === 0) return;

      if (map.current) {
        try { map.current.remove(); } catch (e) { /* ignore */ }
        map.current = null;
      }

      const m = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: pkgData.center as [number, number],
        zoom: pkgData.zoom,
        attributionControl: false,
      });

      map.current = m;
      m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      m.on('load', () => { m.resize(); renderDay(activeDayIndex); });
      m.on('style.load', () => { m.resize(); });
    }, 150);

    return () => {
      clearTimeout(initTimer);
      cancelAllTimers();
      if (map.current) {
        try { map.current.remove(); } catch (e) { /* ignore */ }
        map.current = null;
      }
    };
  }, [pkgData]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded() || !routesData || !pkgData) return;
    renderDay(activeDayIndex);
  }, [activeDayIndex, routesData, pkgData]);

  const cancelAllTimers = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    animationFrameRef.current = null;
    pauseTimerRef.current = null;
    removeMovingMarker();
  };

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
  };

  const clearPopups = () => {
    popupsRef.current.forEach(p => p.remove());
    popupsRef.current = [];
  };

  const removeMovingMarker = () => {
    if (movingMarkerRef.current) {
      movingMarkerRef.current.remove();
      movingMarkerRef.current = null;
    }
  };

  const clearLayers = () => {
    if (!map.current) return;
    const m = map.current;
    for (const id of layerIdsRef.current) { if (m.getLayer(id)) m.removeLayer(id); }
    for (const id of sourceIdsRef.current) { if (m.getSource(id)) m.removeSource(id); }
    layerIdsRef.current = [];
    sourceIdsRef.current = [];
  };

  const renderDay = (dayIdx: number) => {
    if (!map.current || !pkgData || !routesData) return;
    const m = map.current;

    clearMarkers();
    clearPopups();
    clearLayers();
    removeMovingMarker();

    const dayData = pkgData.days.find(d => d.dayIndex === dayIdx);
    const dayRouteGeo = routesData.days.find((d: DayRoute) => d.dayIndex === dayIdx);
    if (!dayData || !dayRouteGeo) return;

    // 1. Draw route segments
    const segments = dayRouteGeo.segments || [];
    segments.forEach((seg: RouteSegment, segIdx: number) => {
      if (!seg.geometry) return;
      const sourceId = `route-seg-${segIdx}`;
      const layerId = `route-seg-line-${segIdx}`;
      const isSea = seg.transport === 'sea';

      m.addSource(sourceId, {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: seg.geometry }
      });

      m.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': isSea ? '#60A5FA' : dayData.color,
          'line-width': isSea ? 3 : 4,
          'line-opacity': isSea ? 0.5 : 0.7,
          'line-dasharray': isSea ? [4, 4] : [2, 2],
        }
      });

      sourceIdsRef.current.push(sourceId);
      layerIdsRef.current.push(layerId);
    });

    // 2. Add markers (merge duplicates with &)
    const allStops = getDayStops(dayData);
    const coordMap = new Map<string, number[]>();
    allStops.forEach((stop, index) => {
      const key = stop.coordinates.join(',');
      if (!coordMap.has(key)) coordMap.set(key, []);
      coordMap.get(key)!.push(index + 1);
    });

    const placedCoords = new Set<string>();

    allStops.forEach((stop) => {
      const key = stop.coordinates.join(',');
      if (placedCoords.has(key)) return;
      placedCoords.add(key);

      const numbers = coordMap.get(key)!;
      const label = numbers.join('&');

      // Outer container — Mapbox controls its transform for positioning, so keep it clean
      const el = document.createElement('div');
      el.style.cursor = 'pointer';

      // Inner pill — we scale this on hover, not the outer element
      const inner = document.createElement('div');
      inner.style.display = 'flex';
      inner.style.alignItems = 'center';
      inner.style.justifyContent = 'center';
      inner.style.fontWeight = '700';
      inner.style.borderRadius = '9999px';
      inner.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
      inner.style.border = '2px solid #0f172a';
      inner.style.backgroundColor = dayData.color;
      inner.style.color = '#000';
      inner.style.transition = 'transform 0.15s ease';

      if (numbers.length > 1) {
        inner.style.minWidth = '40px';
        inner.style.height = '24px';
        inner.style.padding = '0 6px';
        inner.style.fontSize = '10px';
      } else {
        inner.style.width = '24px';
        inner.style.height = '24px';
        inner.style.fontSize = '11px';
      }

      inner.innerText = label;
      el.appendChild(inner);

      // Hover scale on inner div (not the Mapbox-controlled outer)
      el.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.3)'; });
      el.addEventListener('mouseleave', () => { inner.style.transform = 'scale(1)'; });

      const popup = new mapboxgl.Popup({ offset: 15, closeButton: false, closeOnClick: false, className: 'custom-popup' })
        .setHTML(`<div style="padding:2px 4px"><p style="font-weight:700;color:#0f172a;margin:0;font-size:13px">${stop.name}</p></div>`);

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(stop.coordinates as [number, number])
        .addTo(m);

      // Show popup on hover
      el.addEventListener('mouseenter', () => {
        popup.setLngLat(stop.coordinates as [number, number]).addTo(m);
      });
      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      markersRef.current.push(marker);
      popupsRef.current.push(popup);
    });
  };

  /** Create the moving vehicle marker */
  const createMovingMarker = (coord: [number, number], isSea: boolean): mapboxgl.Marker => {
    const el = document.createElement('div');
    el.style.fontSize = '24px';
    el.style.lineHeight = '1';
    el.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))';
    el.style.zIndex = '50';
    el.innerText = isSea ? '⛴️' : '🚗';

    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat(coord)
      .addTo(map.current!);

    return marker;
  };

  /** Flash a popup at a coordinate for a duration, then remove it */
  const flashStopPopup = (coord: [number, number], name: string, durationMs: number) => {
    if (!map.current) return;
    const popup = new mapboxgl.Popup({ offset: 20, closeButton: false, closeOnClick: false, className: 'custom-popup anim-popup' })
      .setHTML(`<div style="padding:4px 8px"><p style="font-weight:700;color:#0f172a;margin:0;font-size:13px">📍 ${name}</p></div>`)
      .setLngLat(coord)
      .addTo(map.current);

    setTimeout(() => popup.remove(), durationMs);
  };

  useImperativeHandle(ref, () => ({
    flyToDay: (dayIdx: number) => {
      if (!map.current || !pkgData || !routesData) return;
      const dayRouteGeo = routesData.days.find((d: DayRoute) => d.dayIndex === dayIdx);

      if (dayRouteGeo && dayRouteGeo.segments) {
        const allCoords: [number, number][] = [];
        for (const seg of dayRouteGeo.segments) {
          if (seg.geometry && seg.geometry.coordinates) allCoords.push(...seg.geometry.coordinates);
        }
        if (allCoords.length > 0) {
          const bounds = allCoords.reduce((b: mapboxgl.LngLatBounds, coord: [number, number]) => b.extend(coord),
            new mapboxgl.LngLatBounds(allCoords[0], allCoords[0]));
          map.current.fitBounds(bounds, { padding: 60, duration: 1000, essential: true });
          return;
        }
      }
      const dayData = pkgData.days.find(d => d.dayIndex === dayIdx);
      if (dayData) {
        const stops = getDayStops(dayData);
        if (stops.length > 0) map.current.flyTo({ center: stops[0].coordinates as [number, number], zoom: 12, duration: 1000 });
      }
    },

    playAnimation: (dayIdx: number) => {
      if (!map.current || !routesData || !pkgData) return;
      const m = map.current;
      const dayRouteGeo = routesData.days.find((d: DayRoute) => d.dayIndex === dayIdx);
      const dayData = pkgData.days.find(d => d.dayIndex === dayIdx);
      if (!dayRouteGeo || !dayData) { onAnimationEnd(); return; }

      const allStops = getDayStops(dayData);

      interface AnimPoint { coord: [number, number]; transport: string; }
      const animPoints: AnimPoint[] = [];

      for (const seg of dayRouteGeo.segments) {
        if (!seg.geometry || !seg.geometry.coordinates) continue;
        const rawCoords = seg.geometry.coordinates as [number, number][];
        if (seg.transport === 'sea') {
          const interpolated = interpolateSeaCoords(rawCoords, 100);
          for (const c of interpolated) animPoints.push({ coord: c, transport: 'sea' });
        } else {
          for (const c of rawCoords) animPoints.push({ coord: c, transport: 'driving' });
        }
      }

      if (animPoints.length === 0) { onAnimationEnd(); return; }

      // Sequential checkpoint matching — each stop must be AFTER the previous
      interface StopCheckpoint { flatIdx: number; stopIdx: number; name: string; coord: [number, number]; }
      const checkpoints: StopCheckpoint[] = [];
      let searchFrom = 0;

      for (let stopIdx = 0; stopIdx < allStops.length; stopIdx++) {
        const stop = allStops[stopIdx];
        let bestDist = Infinity;
        let bestIdx = -1;
        for (let i = searchFrom; i < animPoints.length; i++) {
          const d = coordDist(animPoints[i].coord, stop.coordinates);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        }
        if (bestDist < 0.005 && bestIdx >= 0) {
          checkpoints.push({ flatIdx: bestIdx, stopIdx, name: stop.name, coord: stop.coordinates });
          searchFrom = bestIdx + 1;
        }
      }

      // Cumulative time (sea=30ms/pt, driving=8ms/pt)
      const cumTime: number[] = [0];
      for (let i = 1; i < animPoints.length; i++) {
        cumTime[i] = cumTime[i - 1] + (animPoints[i].transport === 'sea' ? 30 : 8);
      }
      const TOTAL_DURATION = cumTime[cumTime.length - 1];

      const animSourceId = 'route-animated-source';
      const animLayerId = 'route-animated';

      if (!m.getSource(animSourceId)) {
        m.addSource(animSourceId, {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [animPoints[0].coord] } }
        });
        m.addLayer({
          id: animLayerId, type: 'line', source: animSourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#ffffff', 'line-width': 5, 'line-opacity': 1 }
        });
        sourceIdsRef.current.push(animSourceId);
        layerIdsRef.current.push(animLayerId);
      }

      removeMovingMarker();
      movingMarkerRef.current = createMovingMarker(animPoints[0].coord, animPoints[0].transport === 'sea');

      let lastTransport = animPoints[0].transport;
      const hitCheckpoints = new Set<number>();
      let animStartTime = performance.now();
      let timeOffset = 0;
      let lastCameraTime = 0;

      const timeToIndex = (elapsed: number): number => {
        let lo = 0, hi = cumTime.length - 1;
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1;
          if (cumTime[mid] <= elapsed) lo = mid; else hi = mid - 1;
        }
        return lo;
      };

      const tick = (timestamp: number) => {
        const elapsed = (timestamp - animStartTime) + timeOffset;
        const index = Math.min(timeToIndex(elapsed), animPoints.length - 1);

        const pt = animPoints[index];
        if (!pt || !pt.coord) {
          removeMovingMarker();
          if (onStopReached) onStopReached(allStops.length - 1);
          onAnimationEnd();
          return;
        }

        const currentPath = animPoints.slice(0, index + 1).map(p => p.coord);
        const source = m.getSource(animSourceId) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: currentPath } });
        }

        if (movingMarkerRef.current) {
          movingMarkerRef.current.setLngLat(pt.coord);
          if (pt.transport !== lastTransport) {
            movingMarkerRef.current.getElement().innerText = pt.transport === 'sea' ? '⛴️' : '🚗';
            lastTransport = pt.transport;
          }
        }

        // Camera follow every 500ms
        if (elapsed - lastCameraTime > 500) {
          m.easeTo({ center: pt.coord, duration: 600 });
          lastCameraTime = elapsed;
        }

        const hitCP = checkpoints.find(cp => !hitCheckpoints.has(cp.stopIdx) && index >= cp.flatIdx);

        if (hitCP) {
          hitCheckpoints.add(hitCP.stopIdx);
          if (onStopReached) onStopReached(hitCP.stopIdx);
          flashStopPopup(hitCP.coord, hitCP.name, 1200);
          m.easeTo({ center: hitCP.coord, duration: 400 });

          const pausedElapsed = elapsed;
          pauseTimerRef.current = setTimeout(() => {
            timeOffset = pausedElapsed;
            animStartTime = performance.now();
            lastCameraTime = pausedElapsed;
            animationFrameRef.current = requestAnimationFrame(tick);
          }, 1200);
          return;
        }

        if (elapsed < TOTAL_DURATION) {
          animationFrameRef.current = requestAnimationFrame(tick);
        } else {
          removeMovingMarker();
          if (onStopReached) onStopReached(allStops.length - 1);
          onAnimationEnd();
        }
      };

      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(tick);
    },

    pauseAnimation: () => {
      cancelAllTimers();
    }
  }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-dark-950/60 to-transparent pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-dark-950/60 to-transparent pointer-events-none" style={{ zIndex: 1 }} />
    </div>
  );
});

MapView.displayName = "MapView";

export default MapView;

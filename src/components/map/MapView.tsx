'use client';
import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { createRoot, Root } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { useLocale, useTranslations } from 'next-intl';
import { PACKAGE_GEO_DATA, getDayStops } from '@/data/itinerary-geo';
import { NEARBY_POIS, NearbyPOI } from '@/data/nearby-pois';
import PoiCard from './PoiCard';

import routesPackage0 from '@/data/routes/package-0-routes.json';
import routesPackage1 from '@/data/routes/package-1-routes.json';
import routesPackage2 from '@/data/routes/package-2-routes.json';
import type { RouteSegment, DayRoute, PackageRoutes } from '@/types/routes';

const ALL_ROUTES: Record<number, PackageRoutes> = {
  0: routesPackage0 as PackageRoutes,
  1: routesPackage1 as PackageRoutes,
  2: routesPackage2 as PackageRoutes,
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface MapViewHandle {
  flyToDay: (dayIndex: number) => void;
  playAnimation: (dayIndex: number) => void;
  pauseAnimation: () => void;
  flyToStop: (stopIndex: number) => void;
  flyToPoi?: (poi: NearbyPOI) => void;
}

interface MapViewProps {
  packageIndex: number;
  activeDayIndex: number;
  selectedStopIndex?: number | null;
  onAnimationEnd: () => void;
  onStopReached?: (stopIndex: number) => void;
  onDepartStop?: (stopIndex: number) => void;
  onStopSelect?: (stopIndex: number) => void;
}

/** Interpolate extra points along a straight line so sea segments animate smoothly */
function interpolateSeaCoords(
  coords: [number, number][],
  pointCount: number = 200,
): [number, number][] {
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

/** Parse hex color to RGB */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/** Convert RGB to hex */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/** Mix a color towards white (amount 0-1) */
function lightenColor(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  );
}

/** Mix a color towards black (amount 0-1) */
function darkenColor(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(
  ({ packageIndex, activeDayIndex, selectedStopIndex = null, onAnimationEnd, onStopReached, onDepartStop, onStopSelect }, ref) => {
    const locale = useLocale();
    const t = useTranslations('packages');
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const popupsRef = useRef<mapboxgl.Popup[]>([]);
    const poiMarkersRef = useRef<mapboxgl.Marker[]>([]);
    const activePoiPopupRef = useRef<mapboxgl.Popup | null>(null);
    const popupDataRef = useRef<Map<string, mapboxgl.Popup>>(new Map());
    const flashedPopupsRef = useRef<mapboxgl.Popup[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const movingMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const layerIdsRef = useRef<string[]>([]);
    const sourceIdsRef = useRef<string[]>([]);
    const markerDataRef = useRef<
      Map<string, { el: HTMLElement; totalStops: number; visited: number }>
    >(new Map());
    const activeTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const getCategoryEmoji = (category: string) => {
      switch (category) {
        case 'food':
          return '🍴';
        case 'photo':
          return '📷';
        case 'cafe':
          return '☕';
        case 'activity':
          return '🧭';
        default:
          return '📍';
      }
    };

    const poiRootsRef = useRef<Root[]>([]);
    const poiCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const poiPopupsMapRef = useRef<
      Map<string, { marker: mapboxgl.Marker; popup: mapboxgl.Popup; dayColor: string }>
    >(new Map());

    const clearPoiMarkers = useCallback(() => {
      if (poiCloseTimerRef.current) {
        clearTimeout(poiCloseTimerRef.current);
        poiCloseTimerRef.current = null;
      }
      if (activePoiPopupRef.current) {
        activePoiPopupRef.current.remove();
        activePoiPopupRef.current = null;
      }
      poiMarkersRef.current.forEach((m) => m.remove());
      poiMarkersRef.current = [];
      poiPopupsMapRef.current.clear();

      // Clean up React roots asynchronously in a macrotask to prevent React 19 unmount-during-render errors
      const rootsToUnmount = [...poiRootsRef.current];
      poiRootsRef.current = [];

      if (rootsToUnmount.length > 0) {
        setTimeout(() => {
          rootsToUnmount.forEach((r) => {
            try {
              r.unmount();
            } catch {
              /* ignore */
            }
          });
        }, 0);
      }
    }, []);

    const [speedMultiplierUI, setSpeedMultiplierUI] = useState(1);
    const animStateRef = useRef({
      animStartTime: 0,
      timeOffset: 0,
      lastCameraTime: 0,
      speedMultiplier: 1,
      isPlaying: false,
    });

    const handleSpeedChange = (newSpeed: number) => {
      if (animStateRef.current.isPlaying) {
        const now = performance.now();
        const currentElapsed =
          (now - animStateRef.current.animStartTime) *
            animStateRef.current.speedMultiplier +
          animStateRef.current.timeOffset;
        animStateRef.current.timeOffset = currentElapsed;
        animStateRef.current.animStartTime = now;
        animStateRef.current.lastCameraTime = currentElapsed;
      }
      animStateRef.current.speedMultiplier = newSpeed;
      setSpeedMultiplierUI(newSpeed);
    };

    const pkgData = PACKAGE_GEO_DATA.find(
      (p) => p.packageIndex === packageIndex,
    );
    const routesData = ALL_ROUTES[packageIndex] || null;

    const removeMovingMarker = useCallback(() => {
      if (movingMarkerRef.current) {
        movingMarkerRef.current.remove();
        movingMarkerRef.current = null;
      }
    }, []);

    const cancelAllTimers = useCallback((keepVehicle: boolean = false) => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      animationFrameRef.current = null;
      pauseTimerRef.current = null;
      if (animStateRef.current.isPlaying) {
        const now = performance.now();
        const currentElapsed =
          (now - animStateRef.current.animStartTime) *
            animStateRef.current.speedMultiplier +
          animStateRef.current.timeOffset;
        animStateRef.current.timeOffset = currentElapsed;
      }
      animStateRef.current.isPlaying = false;
      if (!keepVehicle) {
        removeMovingMarker();
      }
      // Clean up active popup timeouts
      activeTimeoutsRef.current.forEach(clearTimeout);
      activeTimeoutsRef.current = [];
      // Remove all flashed popups currently on the map
      flashedPopupsRef.current.forEach((p) => p.remove());
      flashedPopupsRef.current = [];
    }, [removeMovingMarker]);

    const clearMarkers = useCallback(() => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    }, []);

    const clearPopups = useCallback(() => {
      popupsRef.current.forEach((p) => p.remove());
      popupsRef.current = [];
    }, []);

    const clearLayers = useCallback(() => {
      if (!map.current) return;
      const m = map.current;
      for (const id of layerIdsRef.current) {
        if (m.getLayer(id)) m.removeLayer(id);
      }
      for (const id of sourceIdsRef.current) {
        if (m.getSource(id)) m.removeSource(id);
      }
      layerIdsRef.current = [];
      sourceIdsRef.current = [];
    }, []);

    const doFlyToDay = useCallback(
      (dayIdx: number, duration: number = 1000) => {
        if (!map.current || !pkgData || !routesData) return;
        const dayRouteGeo = routesData.days.find(
          (d: DayRoute) => d.dayIndex === dayIdx,
        );

        if (dayRouteGeo && dayRouteGeo.segments) {
          const allCoords: [number, number][] = [];
          for (const seg of dayRouteGeo.segments) {
            if (seg.geometry && seg.geometry.coordinates)
              allCoords.push(...seg.geometry.coordinates);
          }
          if (allCoords.length > 0) {
            const bounds = allCoords.reduce(
              (b: mapboxgl.LngLatBounds, coord: [number, number]) =>
                b.extend(coord),
              new mapboxgl.LngLatBounds(allCoords[0], allCoords[0]),
            );
            map.current.fitBounds(bounds, {
              padding: 60,
              duration,
              essential: true,
            });
            return;
          }
        }
        const dayData = pkgData.days.find((d) => d.dayIndex === dayIdx);
        if (dayData) {
          const stops = getDayStops(dayData);
          if (stops.length > 0)
            map.current.flyTo({
              center: stops[0].coordinates as [number, number],
              zoom: 12,
              duration,
            });
        }
      },
      [pkgData, routesData],
    );

    const renderDay = useCallback(
      (dayIdx: number) => {
        if (!map.current || !pkgData || !routesData) return;
        const m = map.current;

        clearMarkers();
        clearPopups();
        clearLayers();
        removeMovingMarker();
        flashedPopupsRef.current.forEach((p) => p.remove());
        flashedPopupsRef.current = [];

        // Reset animation state for the day
        animStateRef.current.timeOffset = 0;
        animStateRef.current.isPlaying = false;

        // Abort previous event listeners to prevent memory leaks
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const dayData = pkgData.days.find((d) => d.dayIndex === dayIdx);
        const dayRouteGeo = routesData.days.find(
          (d: DayRoute) => d.dayIndex === dayIdx,
        );
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
            data: { type: 'Feature', properties: {}, geometry: seg.geometry },
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
            },
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
        markerDataRef.current.clear();
        popupDataRef.current.forEach((p) => p.remove());
        popupDataRef.current.clear();

        allStops.forEach((stop) => {
          const key = stop.coordinates.join(',');
          if (placedCoords.has(key)) return;
          placedCoords.add(key);

          const numbers = coordMap.get(key)!;
          const label = numbers.join('&');

          // Outer container — Mapbox controls its transform for positioning, so keep it clean
          const el = document.createElement('div');
          el.style.cursor = 'pointer';
          el.style.setProperty('z-index', '30', 'important'); // Render above POI markers
          el.style.setProperty('transition', 'none', 'important'); // Keep Mapbox positioning crisp, avoid transition traps

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

          // Store in ref to animate colors later
          markerDataRef.current.set(key, {
            el: inner,
            totalStops: numbers.length,
            visited: 0,
          });

          // Create XSS-Safe DOM Content for Popup
          const popupInner = document.createElement('div');
          popupInner.className = 'popup-inner';
          const popupP = document.createElement('p');
          popupP.textContent = `📍 ${stop.name}`;
          popupInner.appendChild(popupP);

          const popup = new mapboxgl.Popup({
            offset: 20,
            closeButton: false,
            closeOnClick: false,
            className: 'custom-popup anim-popup',
          }).setDOMContent(popupInner);

          popupDataRef.current.set(key, popup);

          const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat(stop.coordinates as [number, number])
            .addTo(m);

          // Hover scale and popup show with abort signal
          el.addEventListener('mouseenter', () => {
            inner.style.transform = 'scale(1.3)';
            popup.setLngLat(stop.coordinates as [number, number]).addTo(m);
            popup.getElement()?.style.setProperty('--popup-color', dayData.color);
          }, { signal });

          el.addEventListener('mouseleave', () => {
            inner.style.transform = 'scale(1)';
            popup.remove();
          }, { signal });

          // Click handler to trigger manual stop selection
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onStopSelect) {
              // numbers[0] is 1-indexed (e.g. Stop 1, Stop 2), so stop index is numbers[0] - 1
              onStopSelect(numbers[0] - 1);
            }
          }, { signal });

          markersRef.current.push(marker);
          popupsRef.current.push(popup);
        });
      },
      [
        pkgData,
        routesData,
        clearMarkers,
        clearPopups,
        clearLayers,
        removeMovingMarker,
        onStopSelect,
      ],
    );

    // Keep a ref of activeDayIndex to avoid map re-initialization inside useEffect
    const activeDayIndexRef = useRef(activeDayIndex);
    useEffect(() => {
      activeDayIndexRef.current = activeDayIndex;
    }, [activeDayIndex]);

    const renderDayRef = useRef(renderDay);
    const doFlyToDayRef = useRef(doFlyToDay);
    const cancelAllTimersRef = useRef(cancelAllTimers);

    useEffect(() => {
      renderDayRef.current = renderDay;
      doFlyToDayRef.current = doFlyToDay;
      cancelAllTimersRef.current = cancelAllTimers;
    }, [renderDay, doFlyToDay, cancelAllTimers]);

    // Initialize Map
    useEffect(() => {
      if (!mapContainer.current || !pkgData) return;

      const initTimer = setTimeout(() => {
        if (!mapContainer.current) return;
        const { offsetWidth, offsetHeight } = mapContainer.current;
        if (offsetWidth === 0 || offsetHeight === 0) return;

        if (map.current) {
          try {
            map.current.remove();
          } catch {
            /* ignore */
          }
          map.current = null;
        }

        const m = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: pkgData.center as [number, number],
          zoom: pkgData.zoom,
          attributionControl: false,
        });

        map.current = m;
        m.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          'top-right',
        );

        m.on('load', () => {
          m.resize();
          renderDayRef.current(activeDayIndexRef.current);
          doFlyToDayRef.current(activeDayIndexRef.current, 800);
        });
        m.on('style.load', () => {
          m.resize();
        });
      }, 150);

      return () => {
        clearTimeout(initTimer);
        cancelAllTimersRef.current();
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        if (map.current) {
          try {
            map.current.remove();
          } catch {
            /* ignore */
          }
          map.current = null;
        }
      };
    }, [pkgData]);

    useEffect(() => {
      if (
        !map.current ||
        !map.current.isStyleLoaded() ||
        !routesData ||
        !pkgData
      )
        return;
      renderDay(activeDayIndex);
    }, [activeDayIndex, routesData, pkgData, renderDay]);

    // Dynamic POI Rendering based on selected stop
    useEffect(() => {
      if (!map.current || !pkgData) return;
      
      clearPoiMarkers();

      if (selectedStopIndex === null || selectedStopIndex === undefined || selectedStopIndex === -1) {
        return;
      }

      const dayData = pkgData.days.find((d) => d.dayIndex === activeDayIndex);
      if (!dayData) return;

      const stops = getDayStops(dayData);
      const stop = stops[selectedStopIndex];
      if (!stop) return;

      const pois = NEARBY_POIS[stop.name] || [];
      if (pois.length === 0) return;

      const startCloseTimer = () => {
        if (poiCloseTimerRef.current) clearTimeout(poiCloseTimerRef.current);
        poiCloseTimerRef.current = setTimeout(() => {
          if (activePoiPopupRef.current) {
            activePoiPopupRef.current.remove();
            activePoiPopupRef.current = null;
          }
        }, 150);
      };

      const bindPopupHoverListeners = (popupInstance: mapboxgl.Popup) => {
        const popupElement = popupInstance.getElement();
        if (popupElement && !popupElement.dataset.hoverBound) {
          popupElement.dataset.hoverBound = 'true';
          popupElement.addEventListener('mouseenter', () => {
            if (poiCloseTimerRef.current) {
              clearTimeout(poiCloseTimerRef.current);
              poiCloseTimerRef.current = null;
            }
          });
          popupElement.addEventListener('mouseleave', () => {
            startCloseTimer();
          });
        }
      };

      pois.forEach((poi) => {
        const el = document.createElement('div');
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.cursor = 'pointer';
        el.style.setProperty('z-index', '20', 'important'); // Render below spot markers
        el.style.setProperty('transition', 'none', 'important'); // Keep Mapbox positioning crisp, avoid transition traps

        const inner = document.createElement('div');
        inner.style.position = 'absolute';
        inner.style.top = '0';
        inner.style.left = '0';
        inner.style.width = '100%';
        inner.style.height = '100%';
        inner.style.borderRadius = '50%';
        inner.style.backgroundColor = 'rgba(10, 28, 25, 0.95)';
        inner.style.border = `2px solid ${dayData.color}`;
        inner.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.6)';
        inner.style.webkitBackfaceVisibility = 'hidden';
        inner.style.backfaceVisibility = 'hidden';
        inner.style.transformStyle = 'preserve-3d';
        inner.style.willChange = 'transform';
        inner.style.transform = 'translateZ(0)';
        inner.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease';

        const iconSpan = document.createElement('span');
        iconSpan.style.position = 'absolute';
        iconSpan.style.top = '50%';
        iconSpan.style.left = '50%';
        iconSpan.style.transform = 'translate(-50%, -50%) translateZ(0)';
        iconSpan.style.display = 'flex';
        iconSpan.style.alignItems = 'center';
        iconSpan.style.justifyContent = 'center';
        iconSpan.style.width = '100%';
        iconSpan.style.height = '100%';
        iconSpan.style.fontSize = '15px';
        iconSpan.style.lineHeight = '1';
        iconSpan.style.pointerEvents = 'none';
        iconSpan.style.webkitBackfaceVisibility = 'hidden';
        iconSpan.style.backfaceVisibility = 'hidden';
        iconSpan.style.transformStyle = 'preserve-3d';
        iconSpan.innerText = getCategoryEmoji(poi.category);

        el.appendChild(inner);
        el.appendChild(iconSpan);

        // Glassmorphic Custom DOM Popup (via React 19 createRoot)
        const popupEl = document.createElement('div');

        // Resolve translations in main React thread scope
        let catLabel = t('categoryActivity');
        if (poi.category === 'food') catLabel = t('categoryFood');
        if (poi.category === 'photo') catLabel = t('categoryPhoto');
        if (poi.category === 'cafe') catLabel = t('categoryCafe');

        const root = createRoot(popupEl);
        root.render(
          <PoiCard
            poi={poi}
            dayColor={dayData.color}
            tCategory={catLabel}
            tMapsLink={t('mapsLink')}
            className='border-0 bg-transparent hover:bg-transparent'
            locale={locale}
          />
        );
        poiRootsRef.current.push(root);

        const popup = new mapboxgl.Popup({
          offset: 26,
          closeButton: false,
          closeOnClick: true,
          className: 'poi-custom-popup anim-popup',
        }).setDOMContent(popupEl);

        // Reset active ref when closed via map click
        popup.on('close', () => {
          if (activePoiPopupRef.current === popup) {
            activePoiPopupRef.current = null;
          }
          if (poiCloseTimerRef.current) {
            clearTimeout(poiCloseTimerRef.current);
            poiCloseTimerRef.current = null;
          }
        });

        el.addEventListener('mouseenter', () => {
          inner.style.transform = 'scale(1.25) translateZ(0)';
          
          if (poiCloseTimerRef.current) {
            clearTimeout(poiCloseTimerRef.current);
            poiCloseTimerRef.current = null;
          }

          if (activePoiPopupRef.current && activePoiPopupRef.current !== popup) {
            activePoiPopupRef.current.remove();
          }

          if (activePoiPopupRef.current !== popup) {
            popup.setLngLat(poi.coordinates as [number, number]).addTo(map.current!);
            popup.getElement()?.style.setProperty('--popup-color', dayData.color);
            activePoiPopupRef.current = popup;
          }

          // Bind listeners to the popup's DOM content to bridge the hover gap
          bindPopupHoverListeners(popup);
        });

        el.addEventListener('mouseleave', () => {
          inner.style.transform = 'scale(1) translateZ(0)';
          startCloseTimer();
        });

        el.addEventListener('click', (e) => {
          e.stopPropagation();

          if (poiCloseTimerRef.current) {
            clearTimeout(poiCloseTimerRef.current);
            poiCloseTimerRef.current = null;
          }

          if (activePoiPopupRef.current && activePoiPopupRef.current !== popup) {
            activePoiPopupRef.current.remove();
          }

          popup.setLngLat(poi.coordinates as [number, number]).addTo(map.current!);
          popup.getElement()?.style.setProperty('--popup-color', dayData.color);
          activePoiPopupRef.current = popup;

          bindPopupHoverListeners(popup);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(poi.coordinates as [number, number])
          .addTo(map.current!);

        poiMarkersRef.current.push(marker);

        const coordKey = poi.coordinates.join(',');
        poiPopupsMapRef.current.set(coordKey, { marker, popup, dayColor: dayData.color });
      });
    }, [selectedStopIndex, activeDayIndex, pkgData, clearPoiMarkers, locale, t]);

    /** Create the moving vehicle marker */
    const createMovingMarker = (
      coord: [number, number],
      isSea: boolean,
    ): mapboxgl.Marker => {
      const el = document.createElement('div');
      el.style.fontSize = '24px';
      el.style.lineHeight = '1';
      el.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))';
      el.style.setProperty('z-index', '50', 'important'); // Render above all markers
      el.style.setProperty('transition', 'none', 'important'); // Keep Mapbox positioning crisp, avoid transition traps
      el.innerText = isSea ? '⛴️' : '🚗';

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(coord)
        .addTo(map.current!);

      return marker;
    };

    /** Flash a popup at a coordinate for a duration, then remove it */
    const flashStopPopup = (
      coord: [number, number],
      name: string,
      durationMs: number,
      color: string,
    ) => {
      if (!map.current) return;
      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: false,
        closeOnClick: false,
        className: 'custom-popup anim-popup',
      })
        .setHTML(
          `
          <div class="popup-inner">
            <p>📍 ${name}</p>
          </div>
        `,
        )
        .setLngLat(coord)
        .addTo(map.current);

      popup.getElement()?.style.setProperty('--popup-color', color);

      flashedPopupsRef.current.push(popup);

      const timer = setTimeout(() => {
        popup.remove();
        flashedPopupsRef.current = flashedPopupsRef.current.filter((p) => p !== popup);
        // Remove this timer from the active list
        activeTimeoutsRef.current = activeTimeoutsRef.current.filter((t) => t !== timer);
      }, durationMs);
      activeTimeoutsRef.current.push(timer);
    };

    useImperativeHandle(ref, () => ({
      flyToDay: (dayIdx: number) => doFlyToDay(dayIdx),

      flyToStop: (stopIndex: number) => {
        if (!map.current || !pkgData) return;
        const dayData = pkgData.days.find((d) => d.dayIndex === activeDayIndexRef.current);
        if (!dayData) return;
        const stops = getDayStops(dayData);
        const stop = stops[stopIndex];
        if (!stop) return;

        // Dynamic zoom level: if spot has POIs, zoom deep to 15.5 so they are beautifully spaced and visible.
        // Otherwise, zoom moderately to 13.5.
        const pois = NEARBY_POIS[stop.name] || [];
        const targetZoom = pois.length > 0 ? 15.5 : 13.5;

        // Fly camera to stop coordinates
        map.current.flyTo({
          center: stop.coordinates as [number, number],
          zoom: targetZoom,
          duration: 1000,
          essential: true,
        });

        // Close all other popups
        popupDataRef.current.forEach((p) => p.remove());

        // Open specific popup for this coordinate
        const coordKey = stop.coordinates.join(',');
        const popup = popupDataRef.current.get(coordKey);
        if (popup) {
          popup.setLngLat(stop.coordinates as [number, number]).addTo(map.current);
          popup.getElement()?.style.setProperty('--popup-color', dayData.color);
        }
      },

      flyToPoi: (poi: NearbyPOI) => {
        if (!map.current) return;

        // Fly camera to POI coordinates
        map.current.flyTo({
          center: poi.coordinates as [number, number],
          zoom: 16.5,
          duration: 1000,
          essential: true,
        });

        // Close all stop popups
        popupDataRef.current.forEach((p) => p.remove());

        // Close any other active POI popups
        if (activePoiPopupRef.current) {
          activePoiPopupRef.current.remove();
          activePoiPopupRef.current = null;
        }

        // Cancel any pending close timers for POI popup
        if (poiCloseTimerRef.current) {
          clearTimeout(poiCloseTimerRef.current);
          poiCloseTimerRef.current = null;
        }

        // Open dynamic glassmorphic popup for this POI
        const coordKey = poi.coordinates.join(',');
        const entry = poiPopupsMapRef.current.get(coordKey);
        if (entry) {
          const { popup, dayColor } = entry;
          popup.setLngLat(poi.coordinates as [number, number]).addTo(map.current);
          popup.getElement()?.style.setProperty('--popup-color', dayColor);
          activePoiPopupRef.current = popup;
        }
      },

      playAnimation: (dayIdx: number) => {
        if (!map.current || !routesData || !pkgData) return;
        const m = map.current;
        const dayRouteGeo = routesData.days.find(
          (d: DayRoute) => d.dayIndex === dayIdx,
        );
        const dayData = pkgData.days.find((d) => d.dayIndex === dayIdx);
        if (!dayRouteGeo || !dayData) {
          onAnimationEnd();
          return;
        }

        const allStops = getDayStops(dayData);

        // Reset markers to base color
        markerDataRef.current.forEach((data) => {
          data.visited = 0;
          data.el.style.backgroundColor = dayData.color;
          data.el.style.color = '#000000';
          data.el.style.opacity = '1';
        });

        interface AnimPoint {
          coord: [number, number];
          transport: string;
        }
        const animPoints: AnimPoint[] = [];

        for (const seg of dayRouteGeo.segments) {
          if (!seg.geometry || !seg.geometry.coordinates) continue;
          const rawCoords = seg.geometry.coordinates as [number, number][];
          if (seg.transport === 'sea') {
            const interpolated = interpolateSeaCoords(rawCoords, 100);
            for (const c of interpolated)
              animPoints.push({ coord: c, transport: 'sea' });
          } else {
            for (const c of rawCoords)
              animPoints.push({ coord: c, transport: 'driving' });
          }
        }

        if (animPoints.length === 0) {
          onAnimationEnd();
          return;
        }

        // Sequential checkpoint matching — each stop must be AFTER the previous
        interface StopCheckpoint {
          flatIdx: number;
          stopIdx: number;
          name: string;
          coord: [number, number];
        }
        const checkpoints: StopCheckpoint[] = [];
        let searchFrom = 0;

        for (let stopIdx = 0; stopIdx < allStops.length; stopIdx++) {
          const stop = allStops[stopIdx];
          let bestDist = Infinity;
          let bestIdx = -1;
          for (let i = searchFrom; i < animPoints.length; i++) {
            const d = coordDist(animPoints[i].coord, stop.coordinates);
            if (d < bestDist) {
              bestDist = d;
              bestIdx = i;
            }
          }
          if (bestDist < 0.005 && bestIdx >= 0) {
            checkpoints.push({
              flatIdx: bestIdx,
              stopIdx,
              name: stop.name,
              coord: stop.coordinates,
            });
            searchFrom = bestIdx + 1;
          }
        }

        // Distance-based speed calculation (speed in degrees per millisecond)
        // Smaller values make the animation slower
        const DRIVING_SPEED = 0.00002;
        const SEA_SPEED = 0.000025;

        const cumTime: number[] = [0];
        for (let i = 1; i < animPoints.length; i++) {
          const dist = coordDist(animPoints[i - 1].coord, animPoints[i].coord);
          const speed = animPoints[i].transport === 'sea' ? SEA_SPEED : DRIVING_SPEED;
          const timeStep = speed > 0 ? (dist / speed) : 0;
          cumTime[i] = cumTime[i - 1] + Math.max(timeStep, 1); // ensure minimum 1ms step
        }
        const TOTAL_DURATION = cumTime[cumTime.length - 1];

        const timeToIndex = (elapsed: number): number => {
          let lo = 0,
            hi = cumTime.length - 1;
          while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (cumTime[mid] <= elapsed) lo = mid;
            else hi = mid - 1;
          }
          return lo;
        };

        const animSourceId = 'route-animated-source';
        const animLayerId = 'route-animated';

        if (!m.getSource(animSourceId)) {
          m.addSource(animSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [animPoints[0].coord],
              },
            },
          });
          m.addLayer({
            id: animLayerId,
            type: 'line',
            source: animSourceId,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': lightenColor(dayData.color, 0.5),
              'line-width': 5,
              'line-opacity': 0.9,
            },
          });
          sourceIdsRef.current.push(animSourceId);
          layerIdsRef.current.push(animLayerId);
        }

        const isResuming = animStateRef.current.timeOffset > 0;
        const currentOffset = animStateRef.current.timeOffset;
        const resumeIndex = isResuming ? timeToIndex(currentOffset) : 0;
        const startPt = animPoints[resumeIndex] || animPoints[0];

        removeMovingMarker();
        movingMarkerRef.current = createMovingMarker(
          startPt.coord,
          startPt.transport === 'sea',
        );

        let lastTransport = startPt.transport;
        const hitCheckpoints = new Set<number>();

        if (isResuming) {
          checkpoints.forEach((cp) => {
            if (resumeIndex >= cp.flatIdx) {
              hitCheckpoints.add(cp.stopIdx);
              const key = cp.coord.join(',');
              const markerData = markerDataRef.current.get(key);
              if (markerData) {
                markerData.visited = markerData.totalStops;
                markerData.el.style.backgroundColor = darkenColor(
                  dayData.color,
                  0.4,
                );
                markerData.el.style.color = '#ffffff';
                markerData.el.style.opacity = '1';
              }
            }
          });
          // Update route rendering to show past path
          const pastPath = animPoints.slice(0, resumeIndex + 1).map((p) => p.coord);
          const source = m.getSource(animSourceId) as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: pastPath },
            });
          }
        }

        animStateRef.current.animStartTime = performance.now();
        if (!isResuming) {
          animStateRef.current.timeOffset = 0;
          animStateRef.current.lastCameraTime = 0;
        } else {
          animStateRef.current.lastCameraTime = currentOffset;
        }
        animStateRef.current.isPlaying = true;

        const tick = (timestamp: number) => {
          const { animStartTime, timeOffset, speedMultiplier } =
            animStateRef.current;
          const elapsed =
            (timestamp - animStartTime) * speedMultiplier + timeOffset;
          const index = Math.min(timeToIndex(elapsed), animPoints.length - 1);

          const pt = animPoints[index];
          if (!pt || !pt.coord) {
            removeMovingMarker();
            animStateRef.current.isPlaying = false;
            animStateRef.current.timeOffset = 0;
            if (onStopReached) onStopReached(allStops.length - 1);
            onAnimationEnd();
            return;
          }

          const currentPath = animPoints
            .slice(0, index + 1)
            .map((p) => p.coord);
          const source = m.getSource(animSourceId) as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: currentPath },
            });
          }

          if (movingMarkerRef.current) {
            movingMarkerRef.current.setLngLat(pt.coord);
            if (pt.transport !== lastTransport) {
              movingMarkerRef.current.getElement().innerText =
                pt.transport === 'sea' ? '⛴️' : '🚗';
              lastTransport = pt.transport;
            }
          }

          // Camera follow every 500ms
          if (elapsed - animStateRef.current.lastCameraTime > 500) {
            m.easeTo({ center: pt.coord, duration: 600 / speedMultiplier });
            animStateRef.current.lastCameraTime = elapsed;
          }

          const hitCP = checkpoints.find(
            (cp) => !hitCheckpoints.has(cp.stopIdx) && index >= cp.flatIdx,
          );

          if (hitCP) {
            hitCheckpoints.add(hitCP.stopIdx);

            // Update marker color
            const key = hitCP.coord.join(',');
            const markerData = markerDataRef.current.get(key);
            if (markerData) {
              markerData.visited += 1;
              if (markerData.visited >= markerData.totalStops) {
                // Fully visited → darker/muted day color
                markerData.el.style.backgroundColor = darkenColor(
                  dayData.color,
                  0.4,
                );
                markerData.el.style.color = '#ffffff';
                markerData.el.style.opacity = '1';
              } else {
                // Partially visited → lighter day color
                markerData.el.style.backgroundColor = lightenColor(
                  dayData.color,
                  0.3,
                );
                markerData.el.style.color = '#000000';
                markerData.el.style.opacity = '1';
              }
            }

            if (onStopReached) onStopReached(hitCP.stopIdx);
            flashStopPopup(hitCP.coord, hitCP.name, 1200, dayData.color);
            m.easeTo({ center: hitCP.coord, duration: 400 });

            const pausedElapsed = elapsed;
            pauseTimerRef.current = setTimeout(() => {
              if (onDepartStop) onDepartStop(hitCP.stopIdx);
              animStateRef.current.timeOffset = pausedElapsed;
              animStateRef.current.animStartTime = performance.now();
              animStateRef.current.lastCameraTime = pausedElapsed;
              animationFrameRef.current = requestAnimationFrame(tick);
            }, 1200 / speedMultiplier);
            return;
          }

          if (elapsed < TOTAL_DURATION) {
            animationFrameRef.current = requestAnimationFrame(tick);
          } else {
            removeMovingMarker();
            animStateRef.current.isPlaying = false;
            animStateRef.current.timeOffset = 0;
            if (onStopReached) onStopReached(allStops.length - 1);
            onAnimationEnd();
          }
        };

        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(tick);
      },

      pauseAnimation: () => {
        cancelAllTimers(true);
      },
    }));

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          ref={mapContainer}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          }}
        />
        <div
          className='absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-dark-950/60 to-transparent pointer-events-none'
          style={{ zIndex: 1 }}
        />
        <div
          className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-dark-950/60 to-transparent pointer-events-none'
          style={{ zIndex: 1 }}
        />

        {/* Speed Controls (Segmented control style) */}
        <div
          className='absolute bottom-3 right-3 flex gap-0.5 rounded-md bg-white/90 p-0.5 backdrop-blur-sm'
          style={{
            zIndex: 50,
            fontFamily: 'Helvetica Neue, Arial, Helvetica, sans-serif',
          }}
        >
          {[1, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`px-2.5 py-1 text-[11px] font-extrabold rounded transition-all duration-150 ${
                speedMultiplierUI === speed
                  ? 'bg-[#333] text-white shadow-sm'
                  : 'text-[#555] hover:text-[#222]'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    );
  },
);

MapView.displayName = 'MapView';

export default MapView;

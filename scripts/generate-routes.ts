import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });
import { PACKAGE_GEO_DATA } from '../src/data/itinerary-geo';
import type { DayRoute, PackageRoutes } from '../src/types/routes';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const OUT_DIR = path.join(__dirname, '../src/data/routes');

if (!GOOGLE_API_KEY) {
  console.error("ERROR: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing in environment variables.");
  process.exit(1);
}

/**
 * Decodes a Google encoded polyline string into [lng, lat] coordinates.
 */
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lng / 100000.0, lat / 100000.0]);
  }
  return points;
}

async function fetchDrivingRoute(coordinates: [number, number][]) {
  // Convert [lng, lat] to "lat,lng" for Google Maps API
  const origin = `${coordinates[0][1]},${coordinates[0][0]}`;
  const destination = `${coordinates[coordinates.length - 1][1]},${coordinates[coordinates.length - 1][0]}`;
  
  let waypointsParam = '';
  if (coordinates.length > 2) {
    const wps = coordinates.slice(1, -1).map(c => `${c[1]},${c[0]}`).join('|');
    waypointsParam = `&waypoints=${wps}`;
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypointsParam}&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch route from Google: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.status !== 'OK') {
    throw new Error(`Google Directions API error status: ${data.status}. Details: ${data.error_message || 'No additional details'}`);
  }

  if (data.routes && data.routes.length > 0) {
    const route = data.routes[0];
    
    // Sum distance and duration from all legs
    let totalDuration = 0;
    let totalDistance = 0;
    if (route.legs) {
      for (const leg of route.legs) {
        totalDuration += leg.duration?.value || 0;
        totalDistance += leg.distance?.value || 0;
      }
    }

    // Decode detailed steps polyline points to get maximum high-fidelity resolution
    const decodedCoords: [number, number][] = [];
    if (route.legs) {
      for (const leg of route.legs) {
        if (leg.steps) {
          for (const step of leg.steps) {
            if (step.polyline && step.polyline.points) {
              const stepCoords = decodePolyline(step.polyline.points);
              for (const coord of stepCoords) {
                if (decodedCoords.length === 0) {
                  decodedCoords.push(coord);
                } else {
                  const last = decodedCoords[decodedCoords.length - 1];
                  // Skip duplicates at steps boundaries
                  if (Math.abs(last[0] - coord[0]) > 1e-6 || Math.abs(last[1] - coord[1]) > 1e-6) {
                    decodedCoords.push(coord);
                  }
                }
              }
            }
          }
        }
      }
    }

    // Fallback if detailed steps coordinate parsing returned nothing
    if (decodedCoords.length === 0 && route.overview_polyline && route.overview_polyline.points) {
      decodedCoords.push(...decodePolyline(route.overview_polyline.points));
    }

    return {
      geometry: {
        type: 'LineString' as const,
        coordinates: decodedCoords,
      },
      duration: totalDuration,
      distance: totalDistance,
    };
  } else {
    throw new Error("No route found in Google response.");
  }
}

function makeSeaRoute(coordinates: [number, number][]) {
  // For sea routes, just use a straight line between points
  return {
    geometry: {
      type: 'LineString' as const,
      coordinates: coordinates,
    },
    duration: 0,
    distance: 0,
  };
}

async function generateRoutes() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  for (const pkg of PACKAGE_GEO_DATA) {
    console.log(`\nGenerating routes for Package ${pkg.packageIndex}...`);
    const packageRoutes: PackageRoutes = { days: [] };

    for (const day of pkg.days) {
      console.log(`  Day ${day.dayIndex}:`);
      const dayRoute: DayRoute = {
        dayIndex: day.dayIndex,
        segments: [],
      };

      for (let segIdx = 0; segIdx < day.segments.length; segIdx++) {
        const seg = day.segments[segIdx];
        const coords = seg.stops.map(s => s.coordinates);

        if (seg.transport === 'sea') {
          console.log(`    Segment ${segIdx} (sea, ${seg.stops.length} stops) — straight line`);
          const seaRoute = makeSeaRoute(coords);
          dayRoute.segments.push({
            transport: 'sea',
            ...seaRoute,
          });
        } else {
          // driving
          if (coords.length < 2) {
            console.warn(`    Segment ${segIdx} (driving) has < 2 stops. Skipping.`);
            dayRoute.segments.push({ transport: 'driving', geometry: null, duration: 0, distance: 0 });
            continue;
          }
          console.log(`    Segment ${segIdx} (driving, ${seg.stops.length} stops) — fetching Google Directions...`);
          try {
            const routeData = await fetchDrivingRoute(coords);
            dayRoute.segments.push({
              transport: 'driving',
              ...routeData,
            });
            await new Promise(resolve => setTimeout(resolve, 200)); // rate limit
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`    Error: ${message}`);
            dayRoute.segments.push({ transport: 'driving', geometry: null, duration: 0, distance: 0 });
          }
        }
      }

      packageRoutes.days.push(dayRoute);
    }

    const outFile = path.join(OUT_DIR, `package-${pkg.packageIndex}-routes.json`);
    fs.writeFileSync(outFile, JSON.stringify(packageRoutes, null, 2));
    console.log(`  Saved → ${outFile}`);
  }

  console.log("\n✅ All routes generated successfully via Google Directions API!");
}

generateRoutes().catch(console.error);

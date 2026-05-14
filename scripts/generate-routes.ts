import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });
import { PACKAGE_GEO_DATA } from '../src/data/itinerary-geo';
import type { RouteSegment, DayRoute, PackageRoutes } from '../src/types/routes';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const OUT_DIR = path.join(__dirname, '../src/data/routes');

if (!MAPBOX_TOKEN) {
  console.error("ERROR: NEXT_PUBLIC_MAPBOX_TOKEN is missing in environment variables.");
  process.exit(1);
}

async function fetchDrivingRoute(coordinates: [number, number][]) {
  const coordsString = coordinates.map((c) => `${c[0]},${c[1]}`).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

  const response = await fetch(url, {
    headers: { 'Referer': 'http://localhost:3000/' }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch route: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.routes && data.routes.length > 0) {
    const route = data.routes[0];
    return {
      geometry: route.geometry,
      duration: route.duration,
      distance: route.distance,
    };
  } else {
    throw new Error("No route found in Mapbox response.");
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
          console.log(`    Segment ${segIdx} (driving, ${seg.stops.length} stops) — fetching Mapbox...`);
          try {
            const routeData = await fetchDrivingRoute(coords);
            dayRoute.segments.push({
              transport: 'driving',
              ...routeData,
            });
            await new Promise(resolve => setTimeout(resolve, 500)); // rate limit
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

  console.log("\n✅ All routes generated successfully!");
}

generateRoutes().catch(console.error);

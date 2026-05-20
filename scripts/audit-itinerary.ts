import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });
import { PACKAGE_GEO_DATA } from '../src/data/itinerary-geo';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const OUT_FILE = path.join(__dirname, '../src/data/itinerary-audit-report.json');

if (!GOOGLE_API_KEY) {
  console.error("ERROR: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing in .env.local");
  process.exit(1);
}

/** Haversine distance in meters between two [lng, lat] pairs */
function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

interface GooglePlaceResult {
  geocodedCoords: [number, number] | null; // [lng, lat]
  geocodedPlaceName: string | null;
  googlePlaceId: string | null;
}

async function searchPlace(
  stopName: string,
  proximity: [number, number], // [lng, lat]
): Promise<GooglePlaceResult> {
  // Clean name: strip parenthetical descriptions for better search
  const cleanName = stopName.replace(/\s*\(.*?\)\s*/g, '').trim();

  // Places API (New) — Text Search
  const url = 'https://places.googleapis.com/v1/places:searchText';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY!,
        'X-Goog-FieldMask': 'places.displayName,places.location,places.id',
      },
      body: JSON.stringify({
        textQuery: `${cleanName} Bali`,
        locationBias: {
          circle: {
            center: { latitude: proximity[1], longitude: proximity[0] },
            radius: 10000.0, // wider radius for main destinations
          },
        },
        maxResultCount: 1,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.warn(`  ⚠ Google API HTTP ${response.status}: ${errBody.slice(0, 200)}`);
      return { geocodedCoords: null, geocodedPlaceName: null, googlePlaceId: null };
    }

    const data = await response.json();

    if (data.places && data.places.length > 0) {
      const place = data.places[0];
      const loc = place.location;
      return {
        geocodedCoords: loc ? [loc.longitude, loc.latitude] : null,
        geocodedPlaceName: place.displayName?.text || null,
        googlePlaceId: place.id || null,
      };
    }

    return { geocodedCoords: null, geocodedPlaceName: null, googlePlaceId: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`  ⚠ Search error for "${stopName}": ${message}`);
    return { geocodedCoords: null, geocodedPlaceName: null, googlePlaceId: null };
  }
}

type Status = '✅ MATCH' | '⚠️ DRIFT' | '🔴 FAR OFF' | '❌ NOT FOUND';

interface AuditEntry {
  stopName: string;
  type: string;
  currentCoords: [number, number];
  googleCoords: [number, number] | null;
  googlePlaceName: string | null;
  googlePlaceId: string | null;
  distanceMeters: number | null;
  status: Status;
}

function getStatus(distanceMeters: number | null): Status {
  if (distanceMeters === null) return '❌ NOT FOUND';
  if (distanceMeters < 500) return '✅ MATCH';
  if (distanceMeters < 3000) return '⚠️ DRIFT'; // slightly larger tolerance for big regions
  return '🔴 FAR OFF';
}

async function auditItineraries() {
  const report: AuditEntry[] = [];
  const statusCounts: Record<Status, number> = {
    '✅ MATCH': 0,
    '⚠️ DRIFT': 0,
    '🔴 FAR OFF': 0,
    '❌ NOT FOUND': 0,
  };

  // Collect unique stops (excluding waypoint)
  const uniqueStopsMap = new Map<string, { name: string; coordinates: [number, number]; type: string }>();
  for (const pkg of PACKAGE_GEO_DATA) {
    for (const day of pkg.days) {
      for (const seg of day.segments) {
        for (const stop of seg.stops) {
          if (stop.type !== 'waypoint') {
            uniqueStopsMap.set(stop.name, stop);
          }
        }
      }
    }
  }

  const uniqueStops = Array.from(uniqueStopsMap.values());
  console.log(`🔍 Auditing ${uniqueStops.length} unique itinerary stops via Google Places API (New)...\n`);

  for (const stop of uniqueStops) {
    const result = await searchPlace(stop.name, stop.coordinates);
    const distanceMeters =
      result.geocodedCoords
        ? Math.round(haversine(stop.coordinates, result.geocodedCoords))
        : null;
    const status = getStatus(distanceMeters);
    statusCounts[status]++;

    const entry: AuditEntry = {
      stopName: stop.name,
      type: stop.type,
      currentCoords: stop.coordinates,
      googleCoords: result.geocodedCoords,
      googlePlaceName: result.geocodedPlaceName,
      googlePlaceId: result.googlePlaceId,
      distanceMeters,
      status,
    };
    report.push(entry);

    const distStr = distanceMeters !== null ? `${distanceMeters}m` : 'N/A';
    const icon = status.split(' ')[0];
    const placeName = result.geocodedPlaceName ? ` → "${result.geocodedPlaceName}"` : '';
    console.log(`  ${icon} [${stop.type.toUpperCase()}] ${stop.name} — ${distStr}${placeName}`);

    // Rate limit
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // Write report
  fs.writeFileSync(OUT_FILE, JSON.stringify(report, null, 2));

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📊 ITINERARY STOPS AUDIT SUMMARY (Google Places API New)`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`Total Stops audited: ${uniqueStops.length}`);
  console.log(`  ✅ MATCH (<500m):    ${statusCounts['✅ MATCH']}`);
  console.log(`  ⚠️  DRIFT (500-3km):  ${statusCounts['⚠️ DRIFT']}`);
  console.log(`  🔴 FAR OFF (>3km):   ${statusCounts['🔴 FAR OFF']}`);
  console.log(`  ❌ NOT FOUND:        ${statusCounts['❌ NOT FOUND']}`);
  console.log(`\nFull report → ${OUT_FILE}`);
}

auditItineraries().catch(console.error);

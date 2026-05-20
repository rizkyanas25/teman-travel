export interface GeoStop {
  name: string;
  coordinates: [number, number]; // [lng, lat]
  type: 'airport' | 'hotel' | 'destination' | 'port' | 'restaurant' | 'waypoint';
}

export interface GeoSegment {
  stops: GeoStop[];
  transport: 'driving' | 'sea'; // sea = straight dashed line, driving = mapbox directions
}

export interface GeoDayRoute {
  dayIndex: number;
  color: string;
  segments: GeoSegment[];
}

export interface PackageGeoData {
  packageIndex: number;
  center: [number, number];
  zoom: number;
  days: GeoDayRoute[];
}

/** Get all stops in a day (flattened from segments), preserving order */
export function getDayStops(day: GeoDayRoute): GeoStop[] {
  const stops: GeoStop[] = [];
  for (const seg of day.segments) {
    for (const stop of seg.stops) {
      // Avoid duplicate consecutive stops at segment boundaries and skip waypoints
      if (stop.type !== 'waypoint' && (stops.length === 0 || stops[stops.length - 1].coordinates.toString() !== stop.coordinates.toString())) {
        stops.push(stop);
      }
    }
  }
  return stops;
}

export const ROUTE_COLORS = [
  '#D4A843', // Day 1: Gold
  '#2DD4BF', // Day 2: Teal
  '#F97316', // Day 3: Orange/Coral
  '#A78BFA', // Day 4: Purple
  '#F472B6', // Day 5: Pink
  '#34D399', // Day 6: Emerald
];

const L: Record<string, GeoStop> = {
  airport:       { name: 'Ngurah Rai Airport',       coordinates: [115.1682, -8.7470], type: 'airport' },
  hotel:         { name: 'Bhanuswari Resort & Spa',   coordinates: [115.2873, -8.5398], type: 'hotel' },
  hotelSouth:    { name: 'Jimbaran Bay Beach Resort', coordinates: [115.1703, -8.7665], type: 'hotel' },
  jimbaran:      { name: 'Jimbaran Beach',            coordinates: [115.1664, -8.7766], type: 'restaurant' },
  sanur:         { name: 'Sanur Port',                coordinates: [115.2608, -8.6696], type: 'port' },
  banjarNyuh:    { name: 'Banjar Nyuh Harbour',       coordinates: [115.4885, -8.6782], type: 'port' },
  seaWP1:        { name: 'Sea Waypoint 1',            coordinates: [115.3500, -8.6500], type: 'waypoint' },
  seaWP2:        { name: 'Sea Waypoint 2',            coordinates: [115.4200, -8.6400], type: 'waypoint' },
  kelingking:    { name: 'Kelingking Beach',          coordinates: [115.4732, -8.7514], type: 'destination' },
  brokenBeach:   { name: 'Broken Beach',              coordinates: [115.4508, -8.7328], type: 'destination' },
  angelBillabong:{ name: 'Angel Billabong',           coordinates: [115.4490, -8.7335], type: 'destination' },
  crystalBay:    { name: 'Crystal Bay',               coordinates: [115.4591, -8.7152], type: 'destination' },
  tegenungan:    { name: 'Tegenungan Waterfall',       coordinates: [115.2890, -8.5754], type: 'destination' },
  tirtaEmpul:    { name: 'Tirta Empul',                coordinates: [115.3153, -8.4157], type: 'destination' },
  coffee:        { name: 'Coffee Plantation',          coordinates: [115.2790, -8.4228], type: 'destination' },
  kintamani:     { name: 'Kintamani',                  coordinates: [115.3374, -8.2591], type: 'restaurant' },
  tegalalang:    { name: 'Tegalalang Rice Terrace',    coordinates: [115.2793, -8.4317], type: 'destination' },
  tukadCepung:   { name: 'Tukad Cepung Waterfall',    coordinates: [115.3868, -8.4410], type: 'destination' },
  pandawa:       { name: 'Pandawa Beach',              coordinates: [115.1871, -8.8453], type: 'destination' },
  gwk:           { name: 'GWK Cultural Park',          coordinates: [115.1676, -8.8104], type: 'destination' },
  uluwatu:       { name: 'Uluwatu Temple',             coordinates: [115.0849, -8.8291], type: 'destination' },
  tanahLot:      { name: 'Tanah Lot',                  coordinates: [115.0868, -8.6212], type: 'destination' },
  jatiluwih:     { name: 'Jatiluwih Rice Terrace',     coordinates: [115.1312, -8.3701], type: 'destination' },
  ulunDanu:      { name: 'Ulun Danu Beratan',          coordinates: [115.1668, -8.2752], type: 'destination' },
  handara:       { name: 'Handara Gate',               coordinates: [115.1583, -8.2530], type: 'destination' },
  tamanAyun:     { name: 'Taman Ayun',                 coordinates: [115.1725, -8.5418], type: 'destination' },
  lempuyang:     { name: 'Lempuyang Temple',           coordinates: [115.6316, -8.3918], type: 'destination' },
};

// Nusa Penida segments (shared across all packages)
const NUSA_PENIDA_SEGMENTS: GeoSegment[] = [
  { transport: 'driving', stops: [L.hotel, L.sanur] },                                      // Drive to port
  { transport: 'sea',     stops: [L.sanur, L.seaWP1, L.seaWP2, L.banjarNyuh] },             // Boat crossing (curved)
  { transport: 'driving', stops: [L.banjarNyuh, L.kelingking, L.brokenBeach, L.angelBillabong, L.crystalBay, L.banjarNyuh] }, // Tour Nusa Penida by land
  { transport: 'sea',     stops: [L.banjarNyuh, L.seaWP2, L.seaWP1, L.sanur] },             // Boat back (curved)
  { transport: 'driving', stops: [L.sanur, L.hotel] },                                      // Drive back to hotel
];

// Day 1: Airport → Jimbaran (nearby for sunset dinner) → Hotel
// This is logical: Jimbaran is ~15min from airport, then head north to Gianyar hotel
const DAY1_ARRIVAL: GeoDayRoute = {
  dayIndex: 0,
  color: ROUTE_COLORS[0],
  segments: [
    { transport: 'driving', stops: [L.airport, L.jimbaran, L.hotel] },
  ],
};

const DAY_NUSA_PENIDA: GeoDayRoute = {
  dayIndex: 1,
  color: ROUTE_COLORS[1],
  segments: NUSA_PENIDA_SEGMENTS,
};

export const PACKAGE_GEO_DATA: PackageGeoData[] = [
  // ===== 4D3N =====
  {
    packageIndex: 0,
    center: [115.3000, -8.5000],
    zoom: 9.5,
    days: [
      DAY1_ARRIVAL,
      DAY_NUSA_PENIDA,
      {
        dayIndex: 2,
        color: ROUTE_COLORS[2],
        segments: [
          { transport: 'driving', stops: [L.hotel, L.tegenungan, L.tirtaEmpul, L.coffee, L.kintamani, L.tegalalang, L.hotel] },
        ],
      },
      {
        dayIndex: 3,
        color: ROUTE_COLORS[3],
        segments: [
          { transport: 'driving', stops: [L.hotel, L.airport] },
        ],
      },
    ],
  },
  // ===== 5D4N =====
  {
    packageIndex: 1,
    center: [115.3000, -8.5000],
    zoom: 9.5,
    days: [
      DAY1_ARRIVAL,
      DAY_NUSA_PENIDA,
      {
        // Day 3: Ubud Cultural Tour → transfer to Jimbaran hotel
        dayIndex: 2,
        color: ROUTE_COLORS[2],
        segments: [
          { transport: 'driving', stops: [L.hotel, L.tukadCepung, L.tirtaEmpul, L.coffee, L.kintamani, L.tegalalang, L.tegenungan, L.hotelSouth] },
        ],
      },
      {
        // Day 4: South Coast (from Jimbaran hotel)
        dayIndex: 3,
        color: ROUTE_COLORS[3],
        segments: [
          { transport: 'driving', stops: [L.hotelSouth, L.pandawa, L.gwk, L.uluwatu, L.hotelSouth] },
        ],
      },
      {
        // Day 5: Departure (Jimbaran → Airport, ~15 min)
        dayIndex: 4,
        color: ROUTE_COLORS[4],
        segments: [
          { transport: 'driving', stops: [L.hotelSouth, L.airport] },
        ],
      },
    ],
  },
  // ===== 6D5N =====
  {
    packageIndex: 2,
    center: [115.3000, -8.5000],
    zoom: 9.5,
    days: [
      DAY1_ARRIVAL,
      DAY_NUSA_PENIDA,
      {
        // Day 3: Ubud & East Bali (returns to Ubud hotel)
        dayIndex: 2,
        color: ROUTE_COLORS[2],
        segments: [
          { transport: 'driving', stops: [L.hotel, L.tukadCepung, L.tirtaEmpul, L.tegalalang, L.kintamani, L.lempuyang, L.hotel] },
        ],
      },
      {
        // Day 4: Bedugul & Tanah Lot → transfer to Jimbaran hotel
        dayIndex: 3,
        color: ROUTE_COLORS[3],
        segments: [
          { transport: 'driving', stops: [L.hotel, L.tamanAyun, L.ulunDanu, L.handara, L.jatiluwih, L.tanahLot, L.hotelSouth] },
        ],
      },
      {
        // Day 5: South Coast (from Jimbaran hotel)
        dayIndex: 4,
        color: ROUTE_COLORS[4],
        segments: [
          { transport: 'driving', stops: [L.hotelSouth, L.pandawa, L.gwk, L.uluwatu, L.hotelSouth] },
        ],
      },
      {
        // Day 6: Departure (Jimbaran → Airport, ~15 min)
        dayIndex: 5,
        color: ROUTE_COLORS[5],
        segments: [
          { transport: 'driving', stops: [L.hotelSouth, L.airport] },
        ],
      },
    ],
  },
];

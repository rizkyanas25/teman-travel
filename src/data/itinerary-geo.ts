export interface GeoStop {
  name: string;
  coordinates: [number, number]; // [lng, lat]
  type: 'airport' | 'hotel' | 'destination' | 'port' | 'restaurant';
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
      // Avoid duplicate consecutive stops at segment boundaries
      if (stops.length === 0 || stops[stops.length - 1].coordinates.toString() !== stop.coordinates.toString()) {
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
  airport:       { name: 'Ngurah Rai Airport',       coordinates: [115.1667, -8.7482], type: 'airport' },
  hotel:         { name: 'Bhanuswari Resort & Spa',   coordinates: [115.2893, -8.5447], type: 'hotel' },
  hotelSouth:    { name: 'Jimbaran Bay Beach Resort', coordinates: [115.1700, -8.7560], type: 'hotel' },
  jimbaran:      { name: 'Jimbaran Beach',            coordinates: [115.1614, -8.7838], type: 'restaurant' },
  sanur:         { name: 'Sanur Port',                coordinates: [115.2685, -8.6867], type: 'port' },
  banjarNyuh:    { name: 'Banjar Nyuh Harbour',       coordinates: [115.5085, -8.6738], type: 'port' },
  kelingking:    { name: 'Kelingking Beach',          coordinates: [115.4705, -8.7505], type: 'destination' },
  brokenBeach:   { name: 'Broken Beach',              coordinates: [115.4526, -8.7297], type: 'destination' },
  angelBillabong:{ name: 'Angel Billabong',           coordinates: [115.4510, -8.7290], type: 'destination' },
  crystalBay:    { name: 'Crystal Bay',               coordinates: [115.4583, -8.7200], type: 'destination' },
  tegenungan:    { name: 'Tegenungan Waterfall',       coordinates: [115.2893, -8.5753], type: 'destination' },
  tirtaEmpul:    { name: 'Tirta Empul',                coordinates: [115.3153, -8.4153], type: 'destination' },
  coffee:        { name: 'Coffee Plantation',          coordinates: [115.3050, -8.4300], type: 'destination' },
  kintamani:     { name: 'Kintamani',                  coordinates: [115.3519, -8.2550], type: 'restaurant' },
  tegalalang:    { name: 'Tegalalang Rice Terrace',    coordinates: [115.2793, -8.4313], type: 'destination' },
  tukadCepung:   { name: 'Tukad Cepung Waterfall',    coordinates: [115.3600, -8.4600], type: 'destination' },
  pandawa:       { name: 'Pandawa Beach',              coordinates: [115.1847, -8.8436], type: 'destination' },
  gwk:           { name: 'GWK Cultural Park',          coordinates: [115.1673, -8.8103], type: 'destination' },
  uluwatu:       { name: 'Uluwatu Temple',             coordinates: [115.0849, -8.8291], type: 'destination' },
  tanahLot:      { name: 'Tanah Lot',                  coordinates: [115.0868, -8.6213], type: 'destination' },
  jatiluwih:     { name: 'Jatiluwih Rice Terrace',     coordinates: [115.1318, -8.3698], type: 'destination' },
  ulunDanu:      { name: 'Ulun Danu Beratan',          coordinates: [115.1673, -8.2753], type: 'destination' },
  handara:       { name: 'Handara Gate',               coordinates: [115.1937, -8.2530], type: 'destination' },
  tamanAyun:     { name: 'Taman Ayun',                 coordinates: [115.1728, -8.5417], type: 'destination' },
  lempuyang:     { name: 'Lempuyang Temple',           coordinates: [115.6384, -8.3934], type: 'destination' },
};

// Nusa Penida segments (shared across all packages)
const NUSA_PENIDA_SEGMENTS: GeoSegment[] = [
  { transport: 'driving', stops: [L.hotel, L.sanur] },                                      // Drive to port
  { transport: 'sea',     stops: [L.sanur, L.banjarNyuh] },                                 // Boat crossing
  { transport: 'driving', stops: [L.banjarNyuh, L.kelingking, L.brokenBeach, L.angelBillabong, L.crystalBay, L.banjarNyuh] }, // Tour Nusa Penida by land
  { transport: 'sea',     stops: [L.banjarNyuh, L.sanur] },                                 // Boat back
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
          { transport: 'driving', stops: [L.hotel, L.tanahLot, L.jatiluwih, L.ulunDanu, L.handara, L.tamanAyun, L.hotelSouth] },
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

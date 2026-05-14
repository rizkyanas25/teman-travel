/** Shared route data types — used by MapView and generate-routes script */

export interface RouteSegment {
  transport: string;
  geometry: { type: 'LineString'; coordinates: [number, number][] } | null;
  duration: number;
  distance: number;
}

export interface DayRoute {
  dayIndex: number;
  segments: RouteSegment[];
}

export interface PackageRoutes {
  days: DayRoute[];
}

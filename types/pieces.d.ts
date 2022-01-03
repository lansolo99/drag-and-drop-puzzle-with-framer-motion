export interface Ipieces {
  id: string;
  layout: Layout;
  coords: number[];
  isPositionned: boolean;
}
export interface Layout {
  grid: string[];
  units: string[];
}
export interface StartZone {
  coords: { mobile: Coords; desktop: Coords };
}

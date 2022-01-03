export interface Islots {
  layout: Layout;
}
export interface Layout {
  grid: string[];
  rows: RowsEntity[];
}
export interface RowsEntity {
  id: number;
  units: string[];
}

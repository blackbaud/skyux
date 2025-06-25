export interface SkyFilterBarFilter {
  id: string | number;
  name: string;
  filterValue?: SkyFilterBarFilterValue;
}

export interface SkyFilterBarFilterValue {
  value: unknown;
  displayValue: string;
}

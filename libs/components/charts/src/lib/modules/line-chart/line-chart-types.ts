import { SkyChartDataPoint } from '../shared/types/chart-data-point';

export type SkyLineDatum = number | null;

export interface SkyLineChartPoint extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyLineDatum;
}

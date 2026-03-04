import { SkyChartDataPoint } from '../shared/types/chart-data-point';

export type SkyBarDatum = number | [number, number] | null;

export interface SkyBarChartPoint extends SkyChartDataPoint {
  /** Numeric value or floating range */
  value: SkyBarDatum;
}

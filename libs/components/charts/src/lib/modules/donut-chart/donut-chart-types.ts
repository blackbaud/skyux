import { SkyChartDataPoint } from '../shared/types/chart-data-point';

export type SkyDonutDatum = number;

export interface SkyDonutChartSlice extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyDonutDatum;
}

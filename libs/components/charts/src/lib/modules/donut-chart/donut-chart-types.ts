import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * A donut chart data point, which is a single numeric value representing the size of the slice.
 */
export type SkyDonutDatum = number;

/**
 * A single data point within a donut chart series.
 * @internal
 */
export interface SkyDonutChartSlice extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyDonutDatum;
}

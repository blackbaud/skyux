import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * A donut chart data point, which is a single numeric value representing the size of the slice.
 */
export type SkyChartDonutDatum = number;

/**
 * A single data point within a donut chart series.
 * @internal
 */
export interface SkyChartDonutSlice extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyChartDonutDatum;
}

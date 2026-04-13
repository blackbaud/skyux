import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * A line chart data point, which is a single numeric value representing the position of the point on the y-axis.
 */
export type SkyLineDatum = number;

/**
 * A single data point within a line chart series.
 * @internal
 */
export interface SkyLineChartPoint extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyLineDatum;
}

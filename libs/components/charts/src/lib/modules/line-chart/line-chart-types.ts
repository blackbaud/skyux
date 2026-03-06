import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * A line chart data point, which is a single numeric value representing the position of the point on the y-axis.
 * A `null` value represents a gap in the data.
 */
export type SkyLineDatum = number | null;

/**
 * A single data point within a line chart series.
 */
export interface SkyLineChartPoint extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyLineDatum;
}

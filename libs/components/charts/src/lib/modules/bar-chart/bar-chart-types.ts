import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * The orientation of the bar chart
 */
export type SkyBarChartOrientation = 'vertical' | 'horizontal';

/**
 * A bar chart data point, which can be a single numeric value or a range (tuple of two numbers).
 */
export type SkyBarDatum = number | [number, number];

/**
 * A single data point within a bar chart series.
 */
export interface SkyBarChartPoint extends SkyChartDataPoint {
  /** Numeric value or floating range */
  value: SkyBarDatum;
}

import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * The orientation of the bar chart
 */
export type SkyBarChartOrientation = 'vertical' | 'horizontal';

/**
 * A bar chart data point, which can be a single numeric value.
 */
export type SkyBarDatum = number;

/**
 * A single data point within a bar chart series.
 * @internal
 */
export interface SkyBarChartPoint extends SkyChartDataPoint {
  /** The bar value */
  value: SkyBarDatum;
}

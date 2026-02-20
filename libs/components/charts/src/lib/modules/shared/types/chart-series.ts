import { SkyChartDataPoint } from './chart-data-point';

/**
 * Represents a data series in a chart.
 */
export interface SkyChartSeries<TData extends SkyChartDataPoint> {
  /**
   * The label for the series
   */
  label: string;

  /**
   * The data points for the series
   */
  data: TData[];
}

import { SkyChartDataPoint } from './chart-data-point';

/**
 * Represents a data series in a chart.
 */
export interface SkyChartSeries<TData extends SkyChartDataPoint> {
  /**
   * The internal unique identifier for the series.
   */
  id: number;

  /**
   * The label for the series
   */
  labelText: string;

  /**
   * The data points for the series
   */
  data: TData[];
}

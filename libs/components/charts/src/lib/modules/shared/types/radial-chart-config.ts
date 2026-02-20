import { SkyChartDataPoint } from './chart-data-point';
import { SkyChartSeries } from './chart-series';

/**
 * Base configuration for Radial Charts (Pie, Donut, Polar Area, Radar)
 */
export interface SkyRadialChartConfig<TData extends SkyChartDataPoint> {
  /**
   * Title for the chart.
   */
  title?: string;

  /**
   * Subtitle for the chart.
   */
  subtitle?: string;

  /**
   * The data series for the chart.
   */
  series: SkyChartSeries<TData>;
}

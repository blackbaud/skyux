import { SkyChartDataPoint } from './chart-data-point';
import { SkyChartSeries } from './chart-series';

/**
 * Base configuration for Radial Charts (Pie, Donut, Polar Area, Radar)
 */
export interface SkyRadialChartConfig<TData extends SkyChartDataPoint> {
  /**
   * The data series for the chart.
   */
  series: SkyChartSeries<TData>;
}

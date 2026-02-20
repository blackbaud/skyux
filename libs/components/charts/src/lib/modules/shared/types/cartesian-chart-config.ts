import {
  SkyChartCategoryAxisConfig,
  SkyChartValueAxisConfig,
} from './axis-types';
import { SkyChartDataPoint } from './chart-data-point';
import { SkyChartSeries } from './chart-series';

/**
 * Base configuration for cartesian charts (Bar, Line, Area, Scatter, Bubble).
 */
export interface SkyCartesianChartConfig<TData extends SkyChartDataPoint> {
  /**
   * The data series for the chart.
   */
  series: SkyChartSeries<TData>[];

  /**
   * Whether the chart should display stacked series.
   */
  stacked?: boolean;

  /**
   * Configuration for the category axis.
   */
  categoryAxis?: SkyChartCategoryAxisConfig;

  /**
   * Configuration for the value axis.
   */
  valueAxis?: SkyChartValueAxisConfig;
}

/**
 * Configuration for cartesian chart axes.
 * This includes both category and value axes, as they share common properties.
 */
export interface SkyChartAxisConfig {
  label?: string;
}

/**
 * Configuration for chart axis settings.
 * Used by cartesian charts (Bar, Line) that have X and Y axes.
 */
export type SkyChartCategoryAxisConfig = SkyChartAxisConfig;

/**
 * Configuration for chart axis settings.
 * Used by cartesian charts (Bar, Line) that have X and Y axes.
 */
export interface SkyChartValueAxisConfig extends SkyChartAxisConfig {
  /**
   * The type of scale to use for the value axis.
   * @default 'linear'
   */
  scaleType?: 'linear' | 'logarithmic';

  /**
   * The suggested minimum value for the axis.
   * If not specified, the chart will automatically determine the minimum based on the data.
   */
  suggestedMin?: number;

  /**
   * The suggested maximum value for the axis.
   * If not specified, the chart will automatically determine the minimum based on the data.
   */
  suggestedMax?: number;
}

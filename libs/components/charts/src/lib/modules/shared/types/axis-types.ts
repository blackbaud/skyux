/**
 * Configuration for chart axes.
 */
export interface SkyChartAxisConfig {
  label?: string;
}

/**
 * Configuration for chart category axis settings.
 */
export type SkyChartCategoryAxisConfig = SkyChartAxisConfig;

/**
 * Configuration for chart value axis settings.
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

  /**
   * A callback function to format the tick labels on the value axis.
   * This function receives the tick value and should return a formatted string.
   * @param value
   * @returns
   */
  tickFormatter?: (value: number | string) => string;
}

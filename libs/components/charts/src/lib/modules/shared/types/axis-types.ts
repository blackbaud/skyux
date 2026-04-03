/**
 * The type for axis label text, which can be a single string or a tuple of strings for dual labels.
 */
export type SkyChartAxisLabelText = string | [string, string];

/**
 * Configuration for chart axes.
 * @internal
 */
export interface SkyChartAxisConfig {
  labelText?: SkyChartAxisLabelText;
}

/**
 * Configuration for chart category axis settings.
 * @internal
 */
export type SkyChartCategoryAxisConfig = SkyChartAxisConfig;

/**
 * Configuration for chart measure axis settings.
 * @internal
 */
export interface SkyChartMeasureAxisConfig extends SkyChartAxisConfig {
  /**
   * The type of scale to use for the measure axis.
   * @default 'linear'
   */
  scaleType?: 'linear' | 'logarithmic';

  /**
   * The hard minimum value for the axis. The axis will not go below this value regardless of the data.
   */
  min?: number;

  /**
   * The hard maximum value for the axis. The axis will not exceed this value regardless of the data.
   */
  max?: number;

  /**
   * The preferred minimum value for the axis. The axis may still go below this value if the data requires it.
   */
  preferredMin?: number;

  /**
   * The preferred maximum value for the axis. The axis may still exceed this value if the data requires it.
   */
  preferredMax?: number;
}

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
   * When true, `min` acts as a soft lower bound: the axis starts at `min` but may extend below it if the data requires it.
   * When false or omitted, `min` is a hard lower bound and the axis will never go below it.
   */
  allowMinOverflow?: boolean;

  /**
   * When true, `max` acts as a soft upper bound: the axis starts at `max` but may extend above it if the data requires it.
   * When false or omitted, `max` is a hard upper bound and the axis will never exceed it.
   */
  allowMaxOverflow?: boolean;
}

/**
 * Base configuration shared by all chart types.
 */
export interface SkyChartConfigBase {
  title?: string;
  subtitle?: string;
}

export type SkyCategory = string | number;

export type SkyBaseDatum = number | null;

/**
 * Represents a data series in a chart.
 * This is a generic structure that can be used across different chart types.
 */
export interface SkyChartSeries<TData extends SkyChartDataPoint> {
  /** The label for the series */
  label: string;

  /** The data points for the series */
  data: TData[];
}

export interface SkyChartDataPoint {
  /** The label for the datapoint */
  label: string;

  /** The category */
  category: SkyCategory;
}

/**
 * Data emitted when a chart's data point is clicked.
 */
export interface SkyChartDataPointClickEvent {
  /** The index of the series that was clicked. */
  seriesIndex: number;

  /** * The index of the data point within the series. */
  dataIndex: number;
}

// #region Axis
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
// #endregion

// #region Base Configuration

/**
 * Base configuration for cartesian charts (Bar, Line, Area, Scatter, Bubble).
 */
export interface SkyCartesianChartConfig<TData extends SkyChartDataPoint>
  extends SkyChartConfigBase {
  series: SkyChartSeries<TData>[];

  /** Should the data be stacked */
  stacked?: boolean;

  categoryAxis?: SkyChartCategoryAxisConfig;
  valueAxis?: SkyChartValueAxisConfig;
}

/**
 * Base configuration for Radial Charts (Pie, Donut, Polar Area, Radar)
 */
export interface SkyRadialChartConfig<TData extends SkyChartDataPoint>
  extends SkyChartConfigBase {
  series: SkyChartSeries<TData>;
}
// #endregion

// #region Utility Types
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? DeepPartialArray<U>
    : T extends object
      ? DeepPartialObject<T>
      : T | undefined;

type DeepPartialArray<T> = Array<DeepPartial<T>>;
type DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };
// #endregion

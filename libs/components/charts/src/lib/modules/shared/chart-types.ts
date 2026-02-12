/**
 * Base configuration shared by all chart types.
 */
export interface SkyChartConfigBase {
  title?: string;
  subtitle?: string;
}

/**
 * Represents a data series in a chart.
 * This is a generic structure that can be used across different chart types.
 */
export interface SkyChartSeries {
  /** The label for the series */
  label: string;

  /** The data points for the series */
  data: SkyChartDataPoint[];

  /**
   * The stack identifier. When stacking is enabled series with the same stackId will be stacked together
   * TODO: api - I believe this is only for Bar, Line, Area charts
   */
  stackId?: string;
}

export interface SkyChartDataPoint {
  /** The label for the datapoint */
  label: string;
  /** The value for the datapoint */
  value: number;
}

/**
 * Data emitted when a chart's data point is clicked.
 */
export interface SkyChartDataPointClickEvent {
  /** The index of the series/dataset that was clicked. */
  seriesIndex: number;
  /** * The index of the data point within the series. */
  dataIndex: number;
}

// #region Cartesian Charts (Bar, Line, Area, Scatter, Bubble)

/**
 * Base configuration for cartesian charts (Bar, Line, Area, Scatter, Bubble).
 * Includes axis configuration and orientation.
 */
export interface SkyCartesianChartConfig extends SkyChartConfigBase {
  categories: string[];
  series: SkyChartSeries[];
  orientation?: 'horizontal' | 'vertical';

  /** Should the data be stacked */
  stacked?: boolean;

  categoryAxis?: SkyChartAxisConfig;
  valueAxis?: SkyChartAxisConfig;
}

/**
 * Configuration for chart axis settings.
 * Used by cartesian charts (Bar, Line) that have X and Y axes.
 */
export interface SkyChartAxisConfig {
  /** Whether to always start the axis at zero. */
  beginAtZero?: boolean;
}
// #endregion Bar Charts

// #region Radial Charts (Pie, Donut, Polar Area, Radar)

/**
 * Base configuration for radial charts.
 */
export interface SkyRadialChartConfig extends SkyChartConfigBase {
  categories: string[];
  series: SkyChartSeries;
}

// #endregion

// #region Chart Implementation
/** Configuration for the bar chart component. */
export type SkyBarChartConfig = SkyCartesianChartConfig;

/** Configuration for the bar chart component. */
export type SkyLineChartConfig = SkyCartesianChartConfig;

/** Configuration for the donut chart component. */
export type SkyDonutChartConfig = SkyRadialChartConfig;
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

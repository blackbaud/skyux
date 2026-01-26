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
  data: SkyChartDataPoint[];
}

export interface SkyChartDataPoint {
  /** The label for the datapoint */
  label: string;
  value: number;
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
/**
 * Configuration for the bar chart component.
 */
export type SkyBarChartConfig = SkyCartesianChartConfig;

/**
 * Configuration for the pie chart component.
 */
export type SkyPieChartConfig = SkyRadialChartConfig;
// #endregion

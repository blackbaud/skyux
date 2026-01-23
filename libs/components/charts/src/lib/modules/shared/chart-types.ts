/**
 * Represents a data series in a chart.
 * This is a generic structure that can be used across different chart types.
 */
export interface SkyChartSeries {
  /**
   * The localized label for this series (e.g., "Budget", "Actual", "Q1 Sales").
   */
  label: string;

  /**
   * The data values for this series.
   * For cartesian charts (Bar, Line): corresponds to each category.
   * For radial charts (Pie, Donut): represents segment values.
   */
  data: number[];

  /**
   * Optional pre-formatted tooltip labels for each data point.
   * If provided, must have the same length as the data array.
   * These will be displayed in tooltips instead of the raw numeric values.
   *
   * @example
   * For currency values
   * tooltipLabels: ['$120,000', '$85,000']
   *
   * @example
   * For percentages
   * tooltipLabels: ['45.2%', '54.8%']
   */
  tooltipLabels?: string[];
}

/**
 * Base configuration shared by all chart types.
 */
export interface SkyChartConfigBase {
  /**
   * Optional title for the chart.
   */
  title?: string;

  /**
   * Optional subtitle for the chart.
   */
  subtitle?: string;
}

/**
 * Configuration for chart axis settings.
 * Used by cartesian charts (Bar, Line) that have X and Y axes.
 */
export interface SkyChartAxisConfig {
  /**
   * Whether to always start the axis at zero.
   * @default true
   */
  beginAtZero?: boolean;
}

/**
 * Base configuration for cartesian charts (Bar, Line, Area, Scatter, Bubble).
 * Includes axis configuration and orientation.
 */
export interface SkyCartesianChartConfig extends SkyChartConfigBase {
  /**
   * Localized category labels for the chart (e.g., ["Q1", "Q2", "Q3"]).
   * These represent the discrete categories along one axis.
   */
  categories: string[];

  /**
   * Array of data series to display in the chart.
   */
  series: SkyChartSeries[];

  /**
   * Defines the primary axis orientation.
   * - 'horizontal': Categories on Y-axis, values on X-axis
   * - 'vertical': Categories on X-axis, values on Y-axis
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Configuration for the value axis (the axis showing numeric values).
   */
  valueAxis?: SkyChartAxisConfig;

  /**
   * Configuration for the category axis (the axis showing category labels).
   */
  categoryAxis?: SkyChartAxisConfig;
}

/**
 * Base configuration for radial charts (Pie, Donut).
 */
export interface SkyRadialChartConfig extends SkyChartConfigBase {
  /**
   * Localized labels for each data point (e.g., ["Revenue", "Expenses", "Profit"]).
   */
  labels: string[];

  /**
   * Data values for the chart.
   * Each value represents a segment of the radial chart.
   */
  data: number[];
}

/**
 * Configuration for the bar chart component.
 * This type provides a simplified, consumer-friendly API that abstracts
 * away ChartJS implementation details.
 *
 * Bar charts use the cartesian chart configuration, inheriting common
 * properties like categories, series, orientation, and axis configurations.
 * This type can be extended with bar-specific properties if needed in the future
 * (e.g., barThickness, barPercentage, categoryPercentage).
 */
export type SkyBarChartConfig = SkyCartesianChartConfig;

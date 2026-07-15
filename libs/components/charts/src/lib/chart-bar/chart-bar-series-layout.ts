/**
 * How a bar chart arranges the bars of multiple series within each category.
 * `grouped` places the series' bars side by side; `stacked` accumulates the
 * bars into a single bar per category. Both have no visible effect when the
 * chart has a single series.
 *
 * @preview
 */
export type SkyChartBarSeriesLayout = 'grouped' | 'stacked';

/**
 * A single value plotted by a bar chart series: a number renders a standard
 * bar measured from the value axis's baseline, a `[start, end]` tuple renders
 * a floating bar spanning the two values, and `null` renders a gap.
 *
 * @preview
 */
export type SkyChartBarSeriesValue = number | readonly [number, number] | null;

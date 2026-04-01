import type { ChartType } from 'chart.js';

/**
 * A callback that returns a human-readable label for a specific data point,
 * identified by its dataset index and data index.
 *
 * Used by the keyboard navigation plugin to announce consumer-formatted values
 * (e.g. "$10,000") instead of raw numeric data.
 * @param datasetIndex - The ChartJS dataset index that the data point belongs to
 * @param dataIndex - The ChartJS data index of the data point within its dataset
 * @returns A human-readable label for the specified data point
 */
export type SkyValueLabelFn = (
  datasetIndex: number,
  dataIndex: number,
) => string;

/**
 * Per-chart options for the `sky_keyboard_nav` plugin.
 */
export interface SkyKeyboardNavPluginOptions {
  /**
   * Optional callback that provides a human-readable label for a data point.
   * When set, the keyboard navigation screen reader announcement uses this
   * value instead of the raw numeric data from the dataset.
   */
  valueLabel?: SkyValueLabelFn;
}

// Augment Chart.js so `chart.options.plugins.sky_keyboard_nav` is strongly typed.
declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    sky_keyboard_nav?: SkyKeyboardNavPluginOptions;
  }
}

import type { ChartType } from 'chart.js';

/**
 * Per-chart options for the `sky_indicator` plugin.
 */
export interface SkyIndicatorPluginOptions {
  /** Whether data points should be clickable */
  dataPointsClickable?: boolean;
}

// Augment Chart.js so `chart.options.plugins.sky_indicator` is strongly typed.
declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    sky_indicator?: SkyIndicatorPluginOptions;
  }
}

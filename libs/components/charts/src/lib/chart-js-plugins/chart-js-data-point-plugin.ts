import { type Plugin } from 'chart.js';

import { type SkyChartJsDataPointIndex } from './chart-js-data-point-index';

/**
 * Controls the data point plugin of a single chart.
 * @internal
 */
export interface SkyChartJsDataPointPlugin {
  /**
   * The plugin to pass in the chart's `plugins` configuration. It must not be
   * registered globally with `Chart.register`, which would apply it to every
   * Chart.js chart in the consumer's application.
   */
  plugin: Plugin;

  /**
   * Shows the tooltip and focus ring for the data point that has keyboard
   * focus, or clears them when given `undefined`.
   */
  setFocusedDataPoint(dataPoint: SkyChartJsDataPointIndex | undefined): void;

  /**
   * Hides the focused data point's tooltip, keeping its focus ring.
   */
  dismissTooltip(): void;
}

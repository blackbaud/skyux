import { Injectable, inject } from '@angular/core';
import { SkyLiveAnnouncerService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { ChartConfiguration, ChartOptions, ChartType, Plugin } from 'chart.js';

import { createAutoColorPlugin } from '../plugins/auto-color/auto-color-plugin';
import { createIndicatorPlugin } from '../plugins/indicator/indicator-plugin';
import { createKeyboardNavPlugin } from '../plugins/keyboard-nav/keyboard-nav-plugin';
import { getTooltipPluginOptions } from '../plugins/tooltip/tooltip-options';
import { createTooltipShadowPlugin } from '../plugins/tooltip/tooltip-shadow-plugin';

import { SkyChartStyleService } from './chart-style.service';

/**
 * A service that provides global chart configuration by merging user-provided configurations with default settings and plugins.
 * This ensures a consistent look and feel across all charts in the application while allowing for customization on a per-chart basis.
 */
@Injectable({ providedIn: 'root' })
export class SkyChartGlobalConfigService {
  readonly #chartStyleService = inject(SkyChartStyleService);
  readonly #liveAnnouncer = inject(SkyLiveAnnouncerService);
  readonly #resources = inject(SkyLibResourcesService);

  /**
   * Merges the provided chart configuration with global defaults.
   * @param config
   * @returns The merged chart configuration
   */
  public getMergedChartConfiguration<TType extends ChartType = ChartType>(
    config: ChartConfiguration<TType>,
  ): ChartConfiguration<TType> {
    // Data
    const data = config.data ? config.data : { labels: [], datasets: [] };

    // Merge options
    const options = this.#getMergedChartOptions(
      config.options as ChartOptions<TType>,
    );

    // Merge plugins
    const plugins = this.#getMergedPlugins(config.plugins as Plugin<TType>[]);

    const merged: ChartConfiguration<TType> = {
      type: config.type,
      data: data,
      options: options,
      plugins: plugins,
    };

    return merged;
  }

  #getMergedChartOptions<TType extends ChartType = ChartType>(
    options: ChartOptions<TType>,
  ): ChartOptions<TType> {
    const styles = this.#chartStyleService.styles();

    const baseOptions: ChartOptions = {
      // Responsiveness
      responsive: true,
      maintainAspectRatio: false,

      // Layout padding
      layout: { padding: styles.chartPadding },

      // Interaction options - baseline behavior for Hover and Tooltip behavior
      interaction: { mode: 'nearest', intersect: true },

      // Hover options - hovering interactions should be precise
      hover: { mode: 'nearest', intersect: true },

      // Animation options
      animation: { duration: 400, easing: 'easeInOutQuart' },

      // Global plugin options
      plugins: {
        legend: { display: false },
        tooltip: getTooltipPluginOptions(styles),
      },

      // Change the cursor style when hovering over elements
      onHover: (_, elements, chart) => {
        chart.canvas.style.cursor = elements[0] ? 'pointer' : 'default';
      },
    };

    const mergedOptions: ChartOptions<TType> = {
      ...baseOptions,
      ...options,
      plugins: {
        ...baseOptions.plugins,
        ...options?.plugins,
        // Deep merge tooltip to ensure global tooltip config is preserved
        tooltip: {
          ...baseOptions.plugins?.tooltip,
          ...options?.plugins?.tooltip,
        },
        // Deep merge legend to ensure global legend config is preserved
        legend: {
          ...baseOptions.plugins?.legend,
          ...options?.plugins?.legend,
        },
      },
    };

    return mergedOptions;
  }

  #getMergedPlugins<TType extends ChartType = ChartType>(
    plugins: Plugin<TType>[],
  ): Plugin<TType>[] {
    const globalPlugins: Plugin<TType>[] = [
      createAutoColorPlugin(this.#chartStyleService),
      createTooltipShadowPlugin(this.#chartStyleService),
      createKeyboardNavPlugin(this.#resources, this.#liveAnnouncer),
      createIndicatorPlugin(this.#chartStyleService),
    ] as Plugin<TType>[];

    return globalPlugins.concat(plugins ?? []);
  }
}

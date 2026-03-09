import { Injectable, inject } from '@angular/core';

import { ChartConfiguration, ChartOptions, ChartType, Plugin } from 'chart.js';

import { createAutoColorPlugin } from '../plugins/auto-color-plugin';
import { createChartA11yPlugin } from '../plugins/chart-a11y-plugin';
import { getTooltipPluginOptions } from '../plugins/get-tooltip-plugin-options';
import { createTooltipShadowPlugin } from '../plugins/tooltip-shadow-plugin';

import { SkyChartStyleService } from './chart-style.service';

/**
 * A service that provides global chart configuration by merging user-provided configurations with default settings and plugins.
 * This ensures a consistent look and feel across all charts in the application while allowing for customization on a per-chart basis.
 */
@Injectable({ providedIn: 'root' })
export class SkyChartGlobalConfigService {
  readonly #chartStyleService = inject(SkyChartStyleService);

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
      layout: {
        padding: styles.chartPadding,
      },

      // Interaction options
      interaction: {
        mode: 'nearest',
        intersect: false,
      },

      // Animation options
      animation: {
        duration: 400,
        easing: 'easeInOutQuart',
      },

      // Global plugin options
      plugins: {
        legend: { display: false },
        tooltip: getTooltipPluginOptions(styles),
      },
    };

    return {
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
  }

  #getMergedPlugins<TType extends ChartType = ChartType>(
    plugins: Plugin<TType>[],
  ): Plugin<TType>[] {
    const globalPlugins: Plugin<TType>[] = [
      createAutoColorPlugin(this.#chartStyleService),
      createTooltipShadowPlugin(this.#chartStyleService),
      createChartA11yPlugin(this.#chartStyleService),
    ] as Plugin<TType>[];

    return globalPlugins.concat(plugins ?? []);
  }
}

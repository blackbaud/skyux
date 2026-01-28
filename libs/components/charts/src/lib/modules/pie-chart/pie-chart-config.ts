import { ChartOptions } from 'chart.js';

import { SkyuxChartStyles } from '../shared/global-chart-config';
import { getLegendPluginOptions } from '../shared/plugin-config/legend-plugin';
import { getTooltipPluginOptions } from '../shared/plugin-config/tooltip-plugin';

/**
 * Get Base Doughnut Chart Configuration
 * Returns a fresh config with resolved colors at runtime
 */
function getBaseDoughnutChartConfig(): Partial<
  ChartOptions<'pie' | 'doughnut'>
> {
  const options: ChartOptions<'pie' | 'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,

    datasets: {
      doughnut: {
        borderWidth: 2,
        borderColor: SkyuxChartStyles.barBorderColor,
      },
      pie: {
        borderWidth: 2,
        borderColor: SkyuxChartStyles.barBorderColor,
      },
    },

    plugins: {
      // TODO: Previously set boxWidth: 12, boxHeight: 12,
      legend: getLegendPluginOptions({ position: 'right' }),
      // TODO: used the default for mode/intersect
      tooltip: getTooltipPluginOptions(),
    },
  };

  return options;
}

/**
 * Helper function to get complete doughnut chart configuration
 * Merges doughnut chart config with custom configuration
 * Colors are resolved at runtime for proper theme support
 */
export function getSkyuxDoughnutChartConfig(
  customConfig?: Partial<ChartOptions<'pie' | 'doughnut'>>,
): Partial<ChartOptions<'pie' | 'doughnut'>> {
  const baseConfig = getBaseDoughnutChartConfig();

  if (!customConfig) {
    return baseConfig;
  }

  // Deep merge plugins configuration
  const mergedPlugins: any = {
    ...(baseConfig.plugins || {}),
  };

  if (customConfig.plugins) {
    Object.keys(customConfig.plugins).forEach((pluginKey) => {
      const customPlugin = (customConfig.plugins as any)[pluginKey];
      const basePlugin = mergedPlugins[pluginKey] || {};

      if (pluginKey === 'tooltip' && customPlugin) {
        // Deep merge tooltip to preserve backgroundColor, titleColor, bodyColor
        mergedPlugins[pluginKey] = {
          ...basePlugin,
          ...customPlugin,
          callbacks: {
            ...(basePlugin.callbacks || {}),
            ...(customPlugin.callbacks || {}),
          },
        };
      } else if (pluginKey === 'legend' && customPlugin) {
        // Deep merge legend to preserve labels configuration
        mergedPlugins[pluginKey] = {
          ...basePlugin,
          ...customPlugin,
          labels: {
            ...(basePlugin.labels || {}),
            ...(customPlugin.labels || {}),
          },
        };
      } else {
        mergedPlugins[pluginKey] = {
          ...basePlugin,
          ...customPlugin,
        };
      }
    });
  }

  return {
    ...baseConfig,
    ...customConfig,
    plugins: mergedPlugins,
  };
}

/**
 * Get dataset border configuration for doughnut charts
 * Returns border width and color to apply to dataset
 */
export function getSkyuxDoughnutDatasetBorder(): {
  borderWidth: number;
  borderColor: string;
} {
  const borderColor = SkyuxChartStyles.barBorderColor;

  return {
    borderWidth: 2,
    borderColor: borderColor,
  };
}

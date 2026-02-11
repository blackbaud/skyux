import { ChartOptions, ChartType } from 'chart.js';

import { SkyuxChartStyles } from './chart-styles';
import { getLegendPluginOptions } from './plugin-config/legend-plugin';
import { getTooltipPluginOptions } from './plugin-config/tooltip-plugin';

/**
 * Get SKY UX Global Chart.js Configuration
 * Contains default style options that apply to all chart types
 * These options align with SKY UX design system principles
 * Colors and styles are resolved at runtime from CSS custom properties
 */
function getSkyuxGlobalChartConfig(): Partial<ChartOptions> {
  return {
    // Responsiveness
    responsive: true,
    maintainAspectRatio: false,

    // Layout padding
    layout: {
      padding: SkyuxChartStyles.chartPadding,
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
      legend: getLegendPluginOptions(),
      tooltip: getTooltipPluginOptions(),
    },
  };
}

/**
 * Helper function to merge global config with chart-specific config
 * Colors are resolved at runtime for proper theme support
 */
export function mergeChartConfig<T extends ChartType = ChartType>(
  chartSpecificConfig: ChartOptions<T>,
): ChartOptions<T> {
  const globalConfig = getSkyuxGlobalChartConfig();

  return {
    ...globalConfig,
    ...chartSpecificConfig,
    plugins: {
      ...globalConfig.plugins,
      ...chartSpecificConfig?.plugins,
      // Deep merge tooltip to ensure global tooltip config is preserved
      tooltip: {
        ...globalConfig.plugins?.tooltip,
        ...chartSpecificConfig?.plugins?.tooltip,
      },
      // Deep merge legend to ensure global legend config is preserved
      legend: {
        ...globalConfig.plugins?.legend,
        ...chartSpecificConfig?.plugins?.legend,
      },
    },
  };
}

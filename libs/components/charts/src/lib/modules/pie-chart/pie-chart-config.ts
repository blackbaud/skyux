import { ChartOptions } from 'chart.js';

import { SkyuxChartStyles } from '../shared/global-chart-config';
import { getLegendPluginOptions } from '../shared/plugins/legend-plugin';

/**
 * SKY UX Doughnut Chart Configuration
 * Specific style options for doughnut and pie charts
 * Provides reusable configurations aligned with SKY UX design system
 */

/**
 * Get Base Doughnut Chart Configuration
 * Returns a fresh config with resolved colors at runtime
 * Use this as a starting point for doughnut/pie charts
 */
function getBaseDoughnutChartConfig(): Partial<
  ChartOptions<'pie' | 'doughnut'>
> {
  const textColor = SkyuxChartStyles.axisTickColor;
  const fontSize = SkyuxChartStyles.axisTickFontSize;
  const fontFamily = SkyuxChartStyles.fontFamily;
  const fontWeight = SkyuxChartStyles.axisTickFontWeight as any;

  // Get the border color from CSS custom property
  const borderColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--sky-color-background-container-base')
      .trim() || '#000000';

  return {
    responsive: true,
    maintainAspectRatio: false,

    datasets: {
      doughnut: {
        borderWidth: 2,
        borderColor: borderColor,
      },
    },

    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 12,
          font: {
            size: fontSize,
            family: fontFamily,
            weight: fontWeight,
          },
          color: textColor,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: SkyuxChartStyles.tooltipBackgroundColor,
        titleColor: SkyuxChartStyles.tooltipTitleColor,
        bodyColor: SkyuxChartStyles.tooltipBodyColor,
        borderColor: 'transparent',
        borderWidth: 0,
        padding: SkyuxChartStyles.tooltipPadding,
        displayColors: true,
        multiKeyBackground: 'transparent',
        bodySpacing: SkyuxChartStyles.tooltipBodySpacing,
        titleMarginBottom: SkyuxChartStyles.tooltipTitleMarginBottom,
        caretSize: SkyuxChartStyles.tooltipCaretSize,
        boxPadding: SkyuxChartStyles.tooltipBoxPadding,
        caretPadding: 4,
        usePointStyle: true,
        titleFont: {
          family: SkyuxChartStyles.fontFamily,
          size: SkyuxChartStyles.tooltipTitleFontSize,
          weight: SkyuxChartStyles.tooltipTitleFontWeight as any,
        },
        bodyFont: {
          family: SkyuxChartStyles.fontFamily,
          size: SkyuxChartStyles.tooltipBodyFontSize,
          weight: SkyuxChartStyles.tooltipBodyFontWeight as any,
        },
      },
    },
  };
}

/**
 * Doughnut Chart Configuration (deprecated - use getSkyuxDoughnutChartConfig instead)
 * @deprecated Use getSkyuxDoughnutChartConfig() for proper color resolution
 */
export const skyuxDoughnutChartConfig: Partial<
  ChartOptions<'pie' | 'doughnut'>
> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: getLegendPluginOptions({ position: 'right' }),
    tooltip: {
      enabled: true,
    },
  },
};

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

import { ChartOptions } from 'chart.js';

import { SkyuxChartStyles } from '../shared/global-chart-config';
import { getLegendPluginOptions } from '../shared/plugins/legend-plugin';
import { getTooltipPluginOptions } from '../shared/plugins/tooltip-plugin';

/**
 * Get Base Bar Chart Configuration
 * Returns a fresh config with resolved colors at runtime
 */
function getBaseBarChartConfig(): Partial<ChartOptions<'bar'>> {
  const axisColor = SkyuxChartStyles.axisLineColor;
  const gridLineColor = SkyuxChartStyles.axisGridLineColor;
  const textColor = SkyuxChartStyles.axisTickColor;
  const barBorderColor = SkyuxChartStyles.barBorderColor;
  const barBorderRadius = SkyuxChartStyles.barBorderRadius;
  const fontSize = SkyuxChartStyles.axisTickFontSize;
  const fontFamily = SkyuxChartStyles.fontFamily;
  const fontWeight = SkyuxChartStyles.axisTickFontWeight;
  const labelPadding = SkyuxChartStyles.axisTickPadding;

  const options: ChartOptions<'bar'> = {
    indexAxis: 'x',

    // Responsiveness
    responsive: true,
    maintainAspectRatio: false,

    datasets: {
      bar: {
        categoryPercentage: 0.7,
        // barPercentage: 0.7,
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderColor: barBorderColor,
        borderRadius: barBorderRadius,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: gridLineColor,
          drawTicks: false,
        },
        border: {
          display: true,
          color: axisColor,
        },
        ticks: {
          color: textColor,
          font: {
            size: fontSize,
            family: fontFamily,
            weight: fontWeight,
          },
          padding: labelPadding,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: gridLineColor,
          drawTicks: false,
        },
        border: {
          display: true,
          color: axisColor,
        },
        ticks: {
          color: textColor,
          font: {
            size: fontSize,
            family: fontFamily,
            weight: fontWeight,
          },
          padding: labelPadding,
        },
      },
    },
    plugins: {
      legend: getLegendPluginOptions(),
      tooltip: getTooltipPluginOptions(),
    },
  };

  console.log('Base bar chart config:', options);

  return options;
}

/**
 * Helper function to get complete bar chart configuration
 * Merges bar chart config with custom configuration
 * Colors are resolved at runtime for proper theme support
 */
export function getSkyuxBarChartConfig(
  customConfig?: Partial<ChartOptions<'bar'>>,
): Partial<ChartOptions<'bar'>> {
  const baseConfig = getBaseBarChartConfig();

  if (!customConfig) {
    return baseConfig;
  }

  // Deep merge scales configuration
  const mergedScales = {
    ...(baseConfig.scales || {}),
  };

  if (customConfig.scales) {
    Object.keys(customConfig.scales).forEach((scaleKey) => {
      const customScale = (customConfig.scales as any)[scaleKey];
      const baseScale = mergedScales[scaleKey] || {};

      mergedScales[scaleKey] = {
        ...baseScale,
        ...customScale,
        grid: {
          ...(baseScale.grid || {}),
          ...(customScale.grid || {}),
        },
        border: {
          ...(baseScale.border || {}),
          ...(customScale.border || {}),
        },
        ticks: {
          ...(baseScale.ticks || {}),
          ...(customScale.ticks || {}),
        },
      };
    });
  }

  // Deep merge plugins configuration, especially tooltip
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
    scales: mergedScales,
    plugins: mergedPlugins,
  };
}

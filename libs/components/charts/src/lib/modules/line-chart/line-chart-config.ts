import { ChartOptions } from 'chart.js';

import { SkyuxChartStyles } from '../shared/global-chart-config';

/**
 * SKY UX Line Chart Configuration
 * Specific style options for line charts
 * Provides reusable configurations aligned with SKY UX design system
 */

/**
 * Get Base Line Chart Configuration
 * Returns a fresh config with resolved colors at runtime
 * Use this as a starting point for line charts
 */
function getBaseLineChartConfig(): Partial<ChartOptions<'line'>> {
  const axisColor = SkyuxChartStyles.axisLineColor;
  const gridLineColor = SkyuxChartStyles.axisGridLineColor;
  const textColor = SkyuxChartStyles.axisTickColor;
  const fontSize = SkyuxChartStyles.axisTickFontSize;
  const fontFamily = SkyuxChartStyles.fontFamily;
  const fontWeight = SkyuxChartStyles.axisTickFontWeight as any;
  const labelPadding = SkyuxChartStyles.axisTickPadding;
  const lineTension = SkyuxChartStyles.lineTension;
  const lineBorderWidth = SkyuxChartStyles.lineBorderWidth;
  const pointRadius = SkyuxChartStyles.linePointRadius;
  const pointHoverRadius = SkyuxChartStyles.linePointHoverRadius;
  const pointBorderWidth = SkyuxChartStyles.linePointBorderWidth;

  return {
    responsive: true,
    maintainAspectRatio: false,

    elements: {
      line: {
        tension: lineTension,
        borderWidth: lineBorderWidth,
      },
      point: {
        radius: pointRadius,
        hoverRadius: pointHoverRadius,
        borderWidth: pointBorderWidth,
        hoverBorderWidth: pointBorderWidth,
        pointStyle: 'circle',
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
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            size: 11,
            family: fontFamily,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: SkyuxChartStyles.tooltipBackgroundColor,
        titleColor: SkyuxChartStyles.tooltipTitleColor,
        bodyColor: SkyuxChartStyles.tooltipBodyColor,
        borderColor: 'transparent',
        borderWidth: 0,
        padding: SkyuxChartStyles.tooltipPadding,
        titleMarginBottom: SkyuxChartStyles.tooltipTitleMarginBottom,
        bodySpacing: SkyuxChartStyles.tooltipBodySpacing,
        caretSize: SkyuxChartStyles.tooltipCaretSize,
        boxPadding: SkyuxChartStyles.tooltipBoxPadding,
        titleFont: {
          size: SkyuxChartStyles.tooltipTitleFontSize,
          family: fontFamily,
          weight: SkyuxChartStyles.tooltipTitleFontWeight as any,
        },
        bodyFont: {
          size: SkyuxChartStyles.tooltipBodyFontSize,
          family: fontFamily,
          weight: SkyuxChartStyles.tooltipBodyFontWeight as any,
        },
        displayColors: true,
        multiKeyBackground: 'transparent',
      },
    },

    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };
}

/**
 * Get SKY UX Line Chart Configuration with custom options
 * Merges base config with custom options provided
 * @param customConfig Optional custom chart options to merge
 * @returns Merged chart configuration
 */
export function getSkyuxLineChartConfig(
  customConfig?: Partial<ChartOptions<'line'>>,
): Partial<ChartOptions<'line'>> {
  const baseConfig = getBaseLineChartConfig();

  if (!customConfig) {
    return baseConfig;
  }

  // Deep merge scales configuration
  const mergedScales: any = {
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

  // Deep merge plugins configuration
  const mergedPlugins: any = {
    ...(baseConfig.plugins || {}),
  };

  if (customConfig.plugins) {
    Object.keys(customConfig.plugins).forEach((pluginKey) => {
      const customPlugin = (customConfig.plugins as any)[pluginKey];
      const basePlugin = mergedPlugins[pluginKey] || {};

      if (typeof customPlugin === 'object' && customPlugin !== null) {
        mergedPlugins[pluginKey] = {
          ...basePlugin,
          ...customPlugin,
        };
      } else {
        mergedPlugins[pluginKey] = customPlugin;
      }
    });
  }

  // Merge everything together
  return {
    ...baseConfig,
    ...customConfig,
    scales: mergedScales,
    plugins: mergedPlugins,
  };
}

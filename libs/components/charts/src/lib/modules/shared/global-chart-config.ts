import { ChartOptions } from 'chart.js';

import { SkyuxChartStyles } from './chart-styles';

/**
 * Get SKY UX Global Chart.js Configuration
 * Contains default style options that apply to all chart types
 * These options align with SKY UX design system principles
 * Colors and styles are resolved at runtime from CSS custom properties
 */
function getSkyuxGlobalChartConfig(): Partial<ChartOptions> {
  const tooltipBgColor = SkyuxChartStyles.tooltipBackgroundColor;
  const tooltipTextColor = SkyuxChartStyles.tooltipBodyColor;
  const tooltipBorderColor = SkyuxChartStyles.tooltipBorderColor;
  const tooltipBorderWidth = SkyuxChartStyles.tooltipBorderWidth;

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
      // Legend configuration
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: SkyuxChartStyles.legendPointSize,
          boxHeight: SkyuxChartStyles.legendPointSize,
          padding: SkyuxChartStyles.legendLabelsPadding,
          font: {
            family: SkyuxChartStyles.legendFontFamily,
            size: SkyuxChartStyles.legendFontSize,
            weight: SkyuxChartStyles.legendFontWeight,
            lineHeight: SkyuxChartStyles.legendFontLineHeight,
          },
          color: SkyuxChartStyles.legendTextColor,
        },
      },

      // Tooltip configuration
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: tooltipBgColor,
        titleColor: SkyuxChartStyles.tooltipTitleColor,
        bodyColor: tooltipTextColor,
        borderColor: tooltipBorderColor,
        borderWidth: tooltipBorderWidth,
        padding: SkyuxChartStyles.tooltipPadding || 16,
        displayColors: true, // Hide default caret since we draw our own colored one
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
          weight: SkyuxChartStyles.tooltipTitleFontWeight,
        },
        bodyFont: {
          family: SkyuxChartStyles.fontFamily,
          size: SkyuxChartStyles.tooltipBodyFontSize,
          weight: SkyuxChartStyles.tooltipBodyFontWeight,
        },
      },
    },
  };
}

/**
 * Helper function to merge global config with chart-specific config
 * Colors are resolved at runtime for proper theme support
 */
export function mergeChartConfig(chartSpecificConfig: any): any {
  const globalConfig = getSkyuxGlobalChartConfig();

  return {
    ...globalConfig,
    ...chartSpecificConfig,
    plugins: {
      ...globalConfig.plugins,
      ...chartSpecificConfig.plugins,
      // Deep merge tooltip to ensure global tooltip config is preserved
      tooltip: {
        ...globalConfig.plugins?.tooltip,
        ...chartSpecificConfig.plugins?.tooltip,
      },
      // Deep merge legend to ensure global legend config is preserved
      legend: {
        ...globalConfig.plugins?.legend,
        ...chartSpecificConfig.plugins?.legend,
      },
    },
    elements: {
      ...globalConfig.elements,
      ...chartSpecificConfig.elements,
    },
  };
}

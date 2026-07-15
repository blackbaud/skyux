import { type ChartOptions, type ChartType } from 'chart.js/auto';

import { type SkyChartThemeStyles } from '../shared/chart-theme-styles';
import { type SkyChartJsConfig } from './chart-js';

/**
 * Builds the Chart.js `options` shared by every SKY chart type: responsiveness,
 * layout, interaction, hover, animation, and the themed legend and tooltip.
 */
function buildBaseChartJsOptions(
  themeStyles: SkyChartThemeStyles,
): ChartOptions {
  const { font, text, tooltip } = themeStyles;

  const bodyFont = {
    family: font.family,
    size: font.size,
    weight: font.weight,
    lineHeight: text.lineHeight,
  };

  const options: ChartOptions = {
    // Responsiveness: fill the container and re-layout on resize.
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },

    // Interaction: hovering and tooltips target the nearest point precisely.
    interaction: { mode: 'nearest', intersect: true },
    hover: { mode: 'nearest', intersect: true },
    animation: { duration: 400, easing: 'easeInOutQuart' },

    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        position: 'average',
        displayColors: true,
        usePointStyle: true,

        // Interaction
        mode: 'index',
        intersect: false,

        // Typography
        titleColor: text.color,
        titleFont: {
          ...bodyFont,
          weight: font.emphasizedWeight,
        },
        bodyColor: text.color,
        bodyFont,
        footerColor: text.color,
        footerFont: bodyFont,

        // Container
        padding: { ...tooltip.inset },
        cornerRadius: tooltip.cornerRadius,
        borderWidth: tooltip.borderWidth,
        caretSize: 8,
        caretPadding: 4,

        // Color-swatch icon
        boxHeight: tooltip.iconSize,
        boxWidth: tooltip.iconSize,
        boxPadding: tooltip.iconGap,
        multiKeyBackground: 'transparent',

        // Text spacing.
        titleMarginBottom: tooltip.titleGap,
        bodySpacing: tooltip.bodyGap,
        footerMarginTop: tooltip.titleGap,

        // Colors.
        backgroundColor: tooltip.backgroundColor,
        borderColor: tooltip.borderColor,
      },
    },
  };

  return options;
}

/**
 * Extends the shared, themed base options with a chart-type-specific configuration.
 * @internal
 */
export function extendBaseChartJsConfig<TType extends ChartType = ChartType>(
  themeStyles: SkyChartThemeStyles,
  overrides: SkyChartJsConfig<TType>,
): SkyChartJsConfig<TType> {
  const base = buildBaseChartJsOptions(themeStyles);

  const options: ChartOptions = {
    ...base,
    ...overrides.options,
    plugins: {
      ...base.plugins,
      ...overrides.options.plugins,
      legend: {
        ...base.plugins?.legend,
        ...overrides.options.plugins?.legend,
      },
      tooltip: {
        ...base.plugins?.tooltip,
        ...overrides.options.plugins?.tooltip,
      },
    },
  };

  return {
    ...overrides,
    options,
  } as SkyChartJsConfig<TType>;
}

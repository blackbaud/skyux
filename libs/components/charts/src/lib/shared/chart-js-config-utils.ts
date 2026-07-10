import { type ChartOptions, type ChartType } from 'chart.js/auto';

import { type SkyChartJsConfig } from './chart-js';
import { readThemeCssNumber, readThemeCssString } from './theme-css-utils';

/**
 * Builds the Chart.js `options` shared by every SKY chart type: responsiveness,
 * layout, interaction, hover, animation, and the themed legend and tooltip.
 * Theme tokens are resolved to concrete values here because Chart.js renders to
 * a canvas that cannot read CSS custom properties.
 */
function buildBaseChartJsOptions(styles: CSSStyleDeclaration): ChartOptions {
  const fontFamily = readThemeCssString(styles, '--sky-font-family-primary');
  const fontSize = readThemeCssNumber(styles, '--sky-font-size-body-m', 15);
  const lineHeight = readThemeCssNumber(
    styles,
    '--sky-font-line_height-body-m',
    1.5,
  );
  const textColor = readThemeCssString(styles, '--sky-color-text-default');

  const bodyFont = {
    family: fontFamily,
    size: fontSize,
    weight: readThemeCssNumber(styles, '--sky-font-style-body-m', 400),
    lineHeight,
  };

  const options: ChartOptions = {
    // Responsiveness: fill the container and re-layout on resize.
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 150,
    layout: { padding: 0 },

    // Interaction: hovering and tooltips target the nearest point precisely.
    interaction: { mode: 'nearest', intersect: true },
    hover: { mode: 'nearest', intersect: true },
    animation: { duration: 400, easing: 'easeInOutQuart' },

    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        position: 'average',
        displayColors: true,
        usePointStyle: true,

        // Interaction
        mode: 'index',
        intersect: false,

        // Typography
        titleColor: textColor,
        titleFont: {
          family: fontFamily,
          size: fontSize,
          weight: readThemeCssNumber(
            styles,
            '--sky-font-style-emphasized',
            700,
          ),
          lineHeight,
        },
        bodyColor: textColor,
        bodyFont,
        footerColor: textColor,
        footerFont: bodyFont,

        // Container
        padding: {
          top: readThemeCssNumber(
            styles,
            '--sky-comp-chart-tooltip-space-inset-top',
            8,
          ),
          right: readThemeCssNumber(
            styles,
            '--sky-comp-chart-tooltip-space-inset-right',
            12,
          ),
          bottom: readThemeCssNumber(
            styles,
            '--sky-comp-chart-tooltip-space-inset-bottom',
            8,
          ),
          left: readThemeCssNumber(
            styles,
            '--sky-comp-chart-tooltip-space-inset-left',
            12,
          ),
        },
        cornerRadius: readThemeCssNumber(styles, '--sky-border-radius-s', 4),
        borderWidth: readThemeCssNumber(
          styles,
          '--sky-border-width-container-base',
          1,
        ),
        caretSize: 8,
        caretPadding: 4,

        // Color-swatch icon
        boxHeight: readThemeCssNumber(styles, '--sky-size-icon-xs', 16),
        boxWidth: readThemeCssNumber(styles, '--sky-size-icon-xs', 16),
        boxPadding: readThemeCssNumber(styles, '--sky-space-gap-icon-s', 4),
        multiKeyBackground: 'transparent',

        // Text spacing.
        titleMarginBottom: readThemeCssNumber(
          styles,
          '--sky-space-stacked-s',
          8,
        ),
        bodySpacing: readThemeCssNumber(styles, '--sky-space-stacked-0', 0),
        footerMarginTop: readThemeCssNumber(styles, '--sky-space-stacked-s', 8),

        // Colors.
        backgroundColor: readThemeCssString(
          styles,
          '--sky-color-background-container-base',
          '#ffffff',
        ),
        borderColor: readThemeCssString(
          styles,
          '--sky-color-border-container-base',
        ),
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
  styles: CSSStyleDeclaration,
  overrides: SkyChartJsConfig<TType>,
): SkyChartJsConfig<TType> {
  const base = buildBaseChartJsOptions(styles);

  const options: ChartOptions = {
    ...base,
    ...overrides.options,
    plugins: {
      ...base.plugins,
      ...overrides.options.plugins,
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

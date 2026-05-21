import type { CartesianScaleOptions, ScaleOptionsByType } from 'chart.js';

import { SkyChartStyles } from './services/chart-style.service';
import {
  type SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from './types/axis-types';
import type { DeepPartial } from './types/deep-partial-type';

/**
 * Builds the base configuration for a chart scale.
 * @param styles
 * @returns
 */
function buildBaseScale(
  styles: SkyChartStyles,
): DeepPartial<CartesianScaleOptions> {
  return {
    grid: {
      display: true,
      drawTicks: true,
      color: styles.axis.grid.color,
      tickColor: styles.axis.grid.color,
      tickLength: styles.axis.ticks.measureLength,
    },
    border: {
      display: true,
      color: styles.axis.border.color,
    },
    ticks: {
      color: styles.axis.ticks.color,
      font: {
        size: styles.axis.ticks.fontSize,
        family: styles.fontFamily,
        weight: styles.axis.ticks.fontWeight,
      },
      major: { enabled: true },
    },
    title: {
      display: true,
      font: {
        size: styles.axis.title.fontSize,
        family: styles.fontFamily,
      },
      color: styles.axis.title.color,
      padding: {
        top: styles.axis.title.paddingTop,
        bottom: styles.axis.title.paddingBottom,
      },
    },
  };
}

/**
 * Builds the configuration for a category scale based on the provided parameters.
 * @param params
 * @returns
 */
export function buildCategoryScale(params: {
  styles: SkyChartStyles;
  stacked: boolean | undefined;
  categoryAxis?: SkyChartCategoryAxisConfig;
}): DeepPartial<ScaleOptionsByType<'category'>> {
  const { styles, stacked, categoryAxis } = params;
  const base = buildBaseScale(styles);

  const categoryScale: DeepPartial<ScaleOptionsByType<'category'>> = {
    type: 'category',
    stacked: stacked ?? false,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: styles.axis.ticks.padding,
    },
    title: {
      ...base.title,
      display: !!categoryAxis?.labelText,
      text: categoryAxis?.labelText,
    },
  };

  return categoryScale;
}

/**
 * Builds a linear measure scale configuration.
 * @param params
 * @returns Linear Scale Options
 */
export function buildLinearMeasureScale(params: {
  styles: SkyChartStyles;
  stacked: boolean;
  measureAxis?: SkyChartMeasureAxisConfig;
}): DeepPartial<ScaleOptionsByType<'linear'>> {
  const { styles, stacked, measureAxis } = params;
  const base = buildBaseScale(params.styles);

  return {
    type: 'linear',
    stacked: stacked ?? false,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: styles.axis.ticks.padding,
    },
    title: {
      ...base.title,
      display: !!measureAxis?.labelText,
      text: measureAxis?.labelText,
    },
    ...getScaleMinMaxMapping(measureAxis),
  };
}

/**
 * Builds a logarithmic measure scale configuration.
 * @param params
 * @returns Logarithmic Scale Options
 */
export function buildLogarithmicMeasureScale(params: {
  styles: SkyChartStyles;
  stacked: boolean;
  measureAxis?: SkyChartMeasureAxisConfig;
}): DeepPartial<ScaleOptionsByType<'logarithmic'>> {
  const { styles, stacked, measureAxis } = params;
  const base = buildBaseScale(params.styles);

  return {
    type: 'logarithmic',
    stacked: stacked ?? false,
    grid: {
      ...base.grid,
      // Improve readability by filtering away Grid Lines that are not powers of 10
      lineWidth: (ctx): number => {
        const tick = ctx.tick;
        return !tick?.label ? 0 : styles.axis.grid.width;
      },
    },
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: styles.axis.ticks.padding,
      // Improve readability by filtering away Ticks that are not powers of 10
      callback: createLogTickFilter,
    },
    title: {
      ...base.title,
      display: !!measureAxis?.labelText,
      text: measureAxis?.labelText ?? '',
    },
    ...getScaleMinMaxMapping(measureAxis),
  };
}

/**
 * This function maps the min and max values for a chart scale based on the provided configuration.
 * It determines whether to allow overflow for the minimum and maximum values and sets the appropriate properties for the chart scale.
 * @param config
 * @returns
 */
function getScaleMinMaxMapping(config: SkyChartMeasureAxisConfig | undefined): {
  min?: number;
  max?: number;
  suggestedMin?: number;
  suggestedMax?: number;
} {
  if (!config) {
    return {};
  }

  const { min, max, allowMinOverflow, allowMaxOverflow } = config;

  return {
    min: allowMinOverflow ? undefined : min,
    max: allowMaxOverflow ? undefined : max,
    suggestedMin: allowMinOverflow ? min : undefined,
    suggestedMax: allowMaxOverflow ? max : undefined,
  };
}

/**
 * Creates a tick filter function for logarithmic axes that only shows ticks at powers of 10.
 * @param value The tick value
 * @param formatter An optional formatter function to format the tick label
 * @returns The formatted tick label if it's a power of 10, otherwise an empty string for no tick
 */
function createLogTickFilter(value: string | number): string {
  const noTick = '';
  const numeric = Number(value);

  // Show only powers of 10
  const isPowerOf10 = numeric > 0 && Math.log10(numeric) % 1 === 0;

  if (!isPowerOf10) {
    return noTick;
  }

  return numeric.toLocaleString();
}

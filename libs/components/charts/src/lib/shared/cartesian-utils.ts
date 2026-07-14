import {
  type ChartConfiguration as ChartJsConfig,
  type TooltipItem as ChartJsTooltipItem,
} from 'chart.js/auto';

import { SkyChartAxisCategory } from '../chart-axes/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axes/chart-axis-value';
import { SkyChartSeries } from '../chart-series/chart-series';
import type { SkyChartTable } from '../chart-table/chart-table';
import { type SkyChartThemeStyles } from './chart-theme-styles';

/**
 * The Chart.js chart types that plot a category axis against one or more value
 * axes and share the helpers in this module.
 */
type CartesianChartType = 'bar' | 'line';

/**
 * The scale key shared by every series' category axis. Cartesian charts always
 * have exactly one category axis, so a single, stable key is sufficient.
 */
export const CATEGORY_AXIS_ID = 'category';

/**
 * The `scales` shape of a cartesian chart. Bar and line charts register the
 * same cartesian scale types, so the shape is identical across them.
 */
type ChartJsCartesianScales = NonNullable<
  NonNullable<ChartJsConfig<'bar'>['options']>['scales']
>;

/**
 * The themed visual styling shared by every cartesian scale: grid line, tick,
 * border, and text colors, the tick length, and the tick/title fonts. Category
 * and value scales spread this and add their own structural options (type,
 * position, title text, tick callback, and whether grid lines fill the chart
 * area).
 */
interface ChartJsThemedScaleStyle {
  grid: {
    color: string;
    tickColor: string;
    tickLength: number | undefined;
  };
  border: { color: string };
  ticks: {
    color: string;
    font: {
      size: number | undefined;
      family: string;
      weight: number | undefined;
    };
  };
  title: {
    color: string;
    font: { size: number | undefined; family: string };
    padding: { top: number | undefined; bottom: number | undefined };
  };
}

/**
 * How a single series binds to a value axis when building datasets.
 * @internal
 */
export interface CartesianSeriesBinding {
  /**
   * The scale key of the value axis the series plots against.
   */
  valueKey: string;

  /**
   * Formats the series' values using the resolved value axis's format.
   */
  formatValue: (value: number) => string;
}

/**
 * The subset of a cartesian tooltip context the value `label` callback needs.
 * Chart.js types `parsed` and `dataset` as `unknown`/`UnionToIntersection`
 * under a bare generic chart type, so the context is narrowed to this shape.
 */
interface CartesianTooltipContext {
  datasetIndex: number;
  parsed: Record<'x' | 'y', number>;
  dataset: { label?: string };
}

/**
 * Resolves the value axis a series binds to, falling back to the first axis
 * when the series names an axis that does not exist.
 */
function matchSeriesValueAxis(
  series: SkyChartSeries,
  valueAxes: readonly SkyChartAxisValue[],
): { index: number; unmatched: boolean } {
  const wanted = series.valueAxisId();

  if (!wanted) {
    return { index: 0, unmatched: false };
  }

  const index = valueAxes.findIndex((axis) => axis.axisId() === wanted);

  return index === -1
    ? { index: 0, unmatched: true }
    : { index, unmatched: false };
}

/**
 * Whether the axes and series contain enough data to build a chart.
 */
export function hasCartesianData(
  categoryAxis: SkyChartAxisCategory | undefined,
  valueAxes: readonly SkyChartAxisValue[],
  series: readonly SkyChartSeries[],
): categoryAxis is SkyChartAxisCategory {
  return (
    categoryAxis !== undefined && valueAxes.length > 0 && series.length > 0
  );
}

/**
 * Maps each value axis to a stable, internal scale key. User-supplied
 * `axisId`s are never used as scale keys so they cannot collide with the
 * category scale key or with each other; series bind to axes by resolving
 * their `valueAxisId` to an axis index, not by scale key.
 */
export function getValueAxisScaleKeys(
  valueAxes: readonly SkyChartAxisValue[],
): string[] {
  return valueAxes.map((_, index) => `sky-value-${index}`);
}

/**
 * Builds the tabular representation of a cartesian chart for the accessible
 * data table, formatting each series' values with its resolved binding.
 */
export function buildCartesianTable(
  categoryAxis: SkyChartAxisCategory,
  series: readonly SkyChartSeries[],
  bindings: readonly CartesianSeriesBinding[],
): SkyChartTable {
  return {
    categoryLabel: categoryAxis.labelText(),
    categories: categoryAxis.categories(),
    series: series.map((chartSeries, index) => ({
      label: chartSeries.labelText(),
      values: chartSeries.values().map(bindings[index].formatValue),
    })),
  };
}

/**
 * Resolves each series to its value axis scale key and value formatter,
 * warning when a series names a value axis that does not exist.
 * @internal
 */
export function resolveSeriesBindings(options: {
  series: readonly SkyChartSeries[];
  valueAxes: readonly SkyChartAxisValue[];
  valueAxisKeys: readonly string[];
  warn: (message: string) => void;
}): CartesianSeriesBinding[] {
  const { series, valueAxes, valueAxisKeys, warn } = options;

  return series.map((chartSeries) => {
    const { index, unmatched } = matchSeriesValueAxis(chartSeries, valueAxes);

    if (unmatched) {
      warn(
        `The chart series "${chartSeries.labelText()}" specifies valueAxisId ` +
          `"${chartSeries.valueAxisId()}", which does not match any value axis. ` +
          `The series will plot against the first value axis.`,
      );
    }

    return {
      valueKey: valueAxisKeys[index],
      formatValue: valueAxes[index].formatValue(),
    };
  });
}

/**
 * Builds the themed styling shared by every cartesian scale from the resolved
 * theme styles. Building it once keeps every axis visually consistent.
 */
function buildThemedScaleStyle(
  themeStyles: SkyChartThemeStyles,
): ChartJsThemedScaleStyle {
  const { font, text, axis } = themeStyles;

  return {
    grid: {
      color: axis.gridlineColor,
      tickColor: axis.gridlineColor,
      tickLength: axis.tickLength,
    },
    border: {
      color: axis.lineColor,
    },
    ticks: {
      color: text.color,
      font: {
        size: font.smallSize,
        family: font.family,
        weight: font.smallWeight,
      },
    },
    title: {
      color: text.deemphasizedColor,
      font: {
        size: font.smallSize,
        family: font.family,
      },
      padding: {
        top: axis.titleGap,
        bottom: axis.titleGap,
      },
    },
  };
}

/**
 * Builds the category and value axis scales for a cartesian chart. The category
 * axis draws no grid lines across the chart area, and secondary value axes are
 * positioned opposite the primary axis and also omit grid lines to avoid
 * stacking them on top of the primary axis's lines. When `stacked` is set, both
 * the category and value scales stack so that series sharing a value axis
 * accumulate into a single bar per category.
 */
export function buildCartesianScales(options: {
  categoryAxis: SkyChartAxisCategory;
  valueAxes: readonly SkyChartAxisValue[];
  valueAxisKeys: readonly string[];
  isHorizontal: boolean;
  stacked?: boolean;
  themeStyles: SkyChartThemeStyles;
}): ChartJsCartesianScales {
  const {
    categoryAxis,
    valueAxes,
    valueAxisKeys,
    isHorizontal,
    stacked = false,
    themeStyles,
  } = options;
  const indexAxis = isHorizontal ? 'y' : 'x';
  const valueDirection = isHorizontal ? 'x' : 'y';
  const base = buildThemedScaleStyle(themeStyles);

  const scales: ChartJsCartesianScales = {
    [CATEGORY_AXIS_ID]: {
      type: 'category',
      axis: indexAxis,
      position: isHorizontal ? 'left' : 'bottom',
      stacked,
      grid: {
        display: true,
        drawTicks: true,
        // The category axis marks discrete groups, so grid lines running
        // between the bars add clutter without aiding value comparison.
        drawOnChartArea: false,
        ...base.grid,
      },
      border: {
        display: true,
        ...base.border,
      },
      ticks: {
        ...base.ticks,
        major: { enabled: true },
      },
      title: {
        display: !categoryAxis.labelHidden(),
        text: categoryAxis.labelText(),
        ...base.title,
      },
    },
  };

  valueAxes.forEach((axis, index) => {
    const isSecondary = index > 0;
    const formatValue = axis.formatValue();
    const scaleType = axis.scaleType();

    scales[valueAxisKeys[index]] = {
      type: scaleType,
      axis: valueDirection,
      position: isHorizontal
        ? isSecondary
          ? 'top'
          : 'bottom'
        : isSecondary
          ? 'right'
          : 'left',
      stacked,
      grid: {
        ...base.grid,
        drawOnChartArea: !isSecondary,
      },
      border: {
        ...base.border,
      },
      ticks: {
        ...base.ticks,
        padding: 0,
        callback: (tickValue: string | number): string =>
          formatValue(Number(tickValue)),
      },
      title: {
        display: !axis.labelHidden(),
        text: axis.labelText(),
        ...base.title,
      },
    };
  });

  return scales;
}

/**
 * Builds a tooltip `label` callback that formats each point's value using the
 * formatter of the value axis its series binds to.
 */
export function buildValueTooltipLabel<T extends CartesianChartType>(
  formatters: readonly ((value: number) => string)[],
  valueDirection: 'x' | 'y',
): (context: ChartJsTooltipItem<T>) => string {
  return (context: ChartJsTooltipItem<T>): string => {
    const item = context as unknown as CartesianTooltipContext;
    const formatValue = formatters[item.datasetIndex];
    const formatted = formatValue(item.parsed[valueDirection] ?? 0);
    const label = item.dataset.label;

    return label ? `${label}: ${formatted}` : formatted;
  };
}

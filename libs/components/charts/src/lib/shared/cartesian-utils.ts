import {
  type ChartConfiguration as ChartJsConfig,
  type TooltipItem as ChartJsTooltipItem,
} from 'chart.js/auto';

import { SkyChartAxisCategory } from '../chart-axes/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axes/chart-axis-value';
import { SkyChartBarSeries } from '../chart-bar/chart-bar-series';
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
 * The scale key of the value axis. Cartesian charts have exactly one value
 * axis, so a single, stable key is sufficient.
 */
export const VALUE_AXIS_ID = 'value';

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
 * The subset of a cartesian tooltip context the value `label` callback needs.
 * Chart.js types `parsed` and `dataset` as `unknown`/`UnionToIntersection`
 * under a bare generic chart type, so the context is narrowed to this shape.
 */
interface CartesianTooltipContext {
  parsed: Record<'x' | 'y', number>;
  dataset: { label?: string };
}

/**
 * The axes and series a chart needs to render, present only when a category
 * axis, a value axis, and at least one series are all provided.
 */
export interface SkyChartCartesianData {
  categoryAxis: SkyChartAxisCategory;
  valueAxis: SkyChartAxisValue;
  series: readonly SkyChartBarSeries[];
}

/**
 * Resolves the axes and series into the data a chart needs to render, or
 * `undefined` when a required axis or series is missing.
 */
export function resolveCartesianData(
  categoryAxis: SkyChartAxisCategory | undefined,
  valueAxis: SkyChartAxisValue | undefined,
  series: readonly SkyChartBarSeries[],
): SkyChartCartesianData | undefined {
  if (
    categoryAxis === undefined ||
    valueAxis === undefined ||
    series.length === 0
  ) {
    return undefined;
  }

  return { categoryAxis, valueAxis, series };
}

/**
 * Builds the tabular representation of a cartesian chart for the accessible
 * data table, formatting each series' values with the value axis's format.
 */
export function buildCartesianTable(
  categoryAxis: SkyChartAxisCategory,
  series: readonly SkyChartBarSeries[],
  formatValue: (value: number) => string,
): SkyChartTable {
  return {
    categoryLabel: categoryAxis.labelText(),
    categories: categoryAxis.categories(),
    series: series.map((chartSeries) => ({
      label: chartSeries.labelText(),
      values: chartSeries.values().map(formatValue),
    })),
  };
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
 * axis draws no grid lines across the chart area, and the value axis draws them
 * to aid value comparison. When `stacked` is set, both the category and value
 * scales stack so that series accumulate into a single bar per category.
 */
export function buildCartesianScales(options: {
  categoryAxis: SkyChartAxisCategory;
  valueAxis: SkyChartAxisValue;
  isHorizontal: boolean;
  stacked?: boolean;
  themeStyles: SkyChartThemeStyles;
}): ChartJsCartesianScales {
  const {
    categoryAxis,
    valueAxis,
    isHorizontal,
    stacked = false,
    themeStyles,
  } = options;
  const indexAxis = isHorizontal ? 'y' : 'x';
  const valueDirection = isHorizontal ? 'x' : 'y';
  const base = buildThemedScaleStyle(themeStyles);
  const formatValue = valueAxis.formatValue();

  return {
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
    [VALUE_AXIS_ID]: {
      type: valueAxis.scaleType(),
      axis: valueDirection,
      position: isHorizontal ? 'bottom' : 'left',
      stacked,
      grid: {
        ...base.grid,
        drawOnChartArea: true,
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
        display: !valueAxis.labelHidden(),
        text: valueAxis.labelText(),
        ...base.title,
      },
    },
  };
}

/**
 * Builds a tooltip `label` callback that formats each point's value using the
 * value axis's format.
 */
export function buildValueTooltipLabel<T extends CartesianChartType>(
  formatValue: (value: number) => string,
  valueDirection: 'x' | 'y',
): (context: ChartJsTooltipItem<T>) => string {
  return (context: ChartJsTooltipItem<T>): string => {
    const item = context as unknown as CartesianTooltipContext;
    const formatted = formatValue(item.parsed[valueDirection] ?? 0);
    const label = item.dataset.label;

    return label ? `${label}: ${formatted}` : formatted;
  };
}

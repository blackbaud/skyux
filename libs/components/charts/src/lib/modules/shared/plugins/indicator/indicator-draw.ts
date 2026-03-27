import type { ActiveElement, Chart, ChartType } from 'chart.js';

import { getChartType, getDatasetType } from '../../chart-helpers';

import { getBarIndicatorBounds } from './bar-indicator-bounds';
import {
  applyDonutSliceOffset,
  getDonutActiveElement,
} from './donut-indicator-helpers';
import { IndicatorBounds, IndicatorStyles } from './indicator-types';
import { getLineIndicatorBounds } from './line-indicator-bounds';

/**
 * Draws the filled background of an indicator box around the given active elements.
 * Call from `beforeDatasetsDraw` so the fill sits above grid lines but below the data elements.
 */
export function drawIndicatorFill(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): void {
  const { ctx } = chart;
  const { padding, borderRadius, backgroundColor } = styles;
  const chartType = getChartType(chart);

  if (chartType === 'doughnut') {
    const el = getDonutActiveElement(activeElements);
    if (!el) return;

    ctx.save();
    applyDonutSliceOffset(ctx, el);
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    // prettier-ignore
    ctx.arc(el.x, el.y, el.outerRadius + padding, el.startAngle, el.endAngle);
    // prettier-ignore
    ctx.arc(el.x, el.y, el.innerRadius - padding, el.endAngle, el.startAngle, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  } else {
    // prettier-ignore
    const bounds = getCartesianIndicatorBounds(chart, activeElements, styles);
    if (!bounds) return;

    const radii = getIndicatorCornerRadii(chart, borderRadius);

    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    // prettier-ignore
    ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, radii);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Draws the border stroke of an indicator box around the given active elements.
 * Call from `afterDatasetsDraw` so the stroke sits on top of the data elements.
 */
export function drawIndicatorStroke(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): void {
  const { ctx } = chart;
  const { padding, borderRadius, borderColor, borderWidth } = styles;
  const chartType = getChartType(chart);

  if (chartType === 'doughnut') {
    const el = getDonutActiveElement(activeElements);
    if (!el) return;

    ctx.save();
    applyDonutSliceOffset(ctx, el);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    // Trace the full slice outline: outer arc → inner arc (anticlockwise) → close
    ctx.beginPath();
    // prettier-ignore
    ctx.arc(el.x, el.y, el.outerRadius + padding, el.startAngle, el.endAngle);
    // prettier-ignore
    ctx.arc(el.x, el.y, el.innerRadius - padding, el.endAngle, el.startAngle, true);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    return;
  } else {
    // prettier-ignore
    const bounds = getCartesianIndicatorBounds(chart, activeElements, styles);
    if (!bounds) return;

    const radii = getIndicatorCornerRadii(chart, borderRadius);

    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    // prettier-ignore
    ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, radii);
    ctx.stroke();
    ctx.restore();
  }
}

// #region Private

/**
 * Returns per-corner border radii so that only the non-axis end of the indicator box is rounded.
 *
 * For indicator boxes with Vertical Bar Datasets the top corners are rounded;
 * For indicator boxes with Horizontal Bar Datasets the the right corners are rounded.
 * For indicator boxes without Bar Datasets all corners are rounded.
 *
 * @returns Return order matches the Canvas `roundRect` spec: [top-left, top-right, bottom-right, bottom-left]
 */
function getIndicatorCornerRadii(
  chart: Chart,
  borderRadius: number,
): [number, number, number, number] {
  const hasBarDataset = chart.data.datasets.some(
    (ds) => getDatasetType(chart, ds) === 'bar',
  );

  if (hasBarDataset) {
    const isHorizontal = chart.config.options?.indexAxis === 'y';

    // Axis on the left → round the right (non-axis) end.
    if (isHorizontal) {
      return [0, borderRadius, borderRadius, 0];
    }

    // Axis on the bottom → round the top (non-axis) end.
    return [borderRadius, borderRadius, 0, 0];
  }

  return [borderRadius, borderRadius, borderRadius, borderRadius];
}
/**
 * Groups active elements by their dataset's resolved type, computes
 * bounds for each group using the type-specific strategy, then merges
 * them into a single enclosing rectangle.
 */
function getCartesianIndicatorBounds(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): IndicatorBounds | null {
  const groups = groupByDatasetType(chart, activeElements);
  const allBounds: IndicatorBounds[] = [];

  for (const [type, elements] of groups) {
    allBounds.push(getBoundsForType(chart, elements, type, styles));
  }

  if (!allBounds.length) return null;

  return mergeBounds(allBounds);
}

/**
 * Partitions active elements into groups keyed by their dataset's
 * resolved ChartType. Preserves insertion order.
 */
function groupByDatasetType(
  chart: Chart,
  activeElements: ActiveElement[],
): Map<ChartType, ActiveElement[]> {
  const groups = new Map<ChartType, ActiveElement[]>();

  for (const el of activeElements) {
    const dataset = chart.data.datasets[el.datasetIndex];
    const type = getDatasetType(chart, dataset);

    let group = groups.get(type);
    if (!group) {
      group = [];
      groups.set(type, group);
    }
    group.push(el);
  }

  return groups;
}

/**
 * Dispatches to the correct bounds calculator for the given type.
 */
function getBoundsForType(
  chart: Chart,
  elements: ActiveElement[],
  type: ChartType,
  styles: IndicatorStyles,
): IndicatorBounds {
  if (type === 'bar')
    return getBarIndicatorBounds(chart.chartArea, elements, styles);
  if (type === 'line') return getLineIndicatorBounds(elements, styles);

  throw new Error(`Unsupported dataset type for indicator plugin: ${type}`);
}

/**
 * Merges multiple bounding rectangles into the smallest rectangle
 * that encloses all of them.
 */
function mergeBounds(bounds: IndicatorBounds[]): IndicatorBounds {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (const b of bounds) {
    left = Math.min(left, b.x);
    top = Math.min(top, b.y);
    right = Math.max(right, b.x + b.width);
    bottom = Math.max(bottom, b.y + b.height);
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}
// #endregion

import type { ActiveElement, Chart, ChartType } from 'chart.js';

import { getChartType, getDatasetType } from '../../chart-helpers';

import { getBarIndicatorBounds } from './bar-indicator-bounds';
import { getDonutIndicatorBounds } from './donut-indicator-bounds';
import { IndicatorBounds, IndicatorStyles } from './indicator-types';
import { getLineIndicatorBounds } from './line-indicator-bounds';

/**
 * Draws the filled background of an indicator box around the given active elements.
 * Call from `beforeDatasetsDraw` so the fill sits above grid lines but below the data elements.
 * @param chart the chart instance to draw on
 * @param activeElements the active elements to draw the indicator around
 * @param styles the styles to apply to the indicator fill
 */
export function drawIndicatorFill(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): void {
  if (activeElements.length === 0) {
    return;
  }

  const ctx = chart.ctx;
  ctx.save();
  ctx.fillStyle = styles.backgroundColor;
  buildIndicatorPath(ctx, chart, activeElements, styles);
  ctx.fill();
  ctx.restore();
}

/**
 * Draws the border stroke of an indicator box around the given active elements.
 * Call from `afterDatasetsDraw` so the stroke sits on top of the data elements.
 * @param chart the chart instance to draw on
 * @param activeElements the active elements to draw the indicator around
 * @param styles the styles to apply to the indicator stroke
 */
export function drawIndicatorStroke(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): void {
  if (activeElements.length === 0) {
    return;
  }

  const ctx = chart.ctx;
  ctx.save();
  ctx.strokeStyle = styles.borderColor;
  ctx.lineWidth = styles.borderWidth;
  buildIndicatorPath(ctx, chart, activeElements, styles);
  ctx.stroke();
  ctx.restore();
}

/**
 * Builds the path for an indicator based on the active elements and chart type.
 * @param ct the canvas rendering context to build the path on
 * @param chart the chart instance to get necessary context from
 * @param activeElements the active elements to build the indicator path around
 * @param styles the styles to apply to the indicator, used for padding calculations
 */
function buildIndicatorPath(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): void {
  if (getChartType(chart) === 'doughnut') {
    const { x, y, outerRadius, startAngle, endAngle } =
      getDonutIndicatorBounds(activeElements);

    ctx.lineWidth = styles.borderWidth + Math.PI;
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, startAngle, endAngle);
    ctx.arc(x, y, outerRadius, endAngle, startAngle, true);
    ctx.closePath();
  } else {
    const bounds = getCartesianIndicatorBounds(chart, activeElements, styles);
    const radii = getIndicatorCornerRadii(chart, styles.borderRadius);

    ctx.beginPath();
    ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, radii);
  }
}

// #region Cartesian Charts
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
 * Calculates the bounding box for an indicator based on the active elements and chart type.
 * @param chart the chart instance to get necessary context from
 * @param activeElements the active elements to calculate bounds for
 * @param styles the styles to apply to the indicator, used for padding calculations
 * @returns the bounding rectangle for the indicator
 */
function getCartesianIndicatorBounds(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): IndicatorBounds {
  const groups = groupByDatasetType(chart, activeElements);
  const allBounds: IndicatorBounds[] = [];

  for (const [type, elements] of groups) {
    allBounds.push(getBoundsForType(chart, elements, type, styles));
  }

  return mergeBounds(allBounds);
}

/**
 * Partitions active elements into groups keyed by their dataset's resolved type.
 * @param chart the chart instance to get dataset types from
 * @param activeElements the active elements to group
 * @returns a Map where each key is a dataset type and each value is an array of active elements belonging to datasets of that type
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
 * @param chart the chart instance to get necessary context from
 * @param elements the active elements to get bounds for
 * @param type the chart type to determine the bounds calculation strategy
 * @returns the bounding rectangle for the given elements and type
 * @throws if the type is unsupported or if bounds cannot be calculated for the given elements
 */
function getBoundsForType(
  chart: Chart,
  elements: ActiveElement[],
  type: ChartType,
  styles: IndicatorStyles,
): IndicatorBounds {
  if (type === 'bar') {
    return getBarIndicatorBounds(chart.chartArea, elements, styles);
  }
  if (type === 'line') {
    return getLineIndicatorBounds(elements, styles);
  }

  throw new Error(`Unsupported dataset type for indicator plugin: ${type}`);
}

/**
 * Merges multiple bounding rectangles into the smallest rectangle that encloses all of them.
 * @param bounds an array of bounding rectangles to merge
 * @returns a single bounding rectangle that encloses all input rectangles
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

import { ActiveElement, BarElement, ChartArea } from 'chart.js';

import { IndicatorBounds, IndicatorStyles } from './indicator-types';

/**
 * Returns the geometry of an indicator box for the given active bar elements.
 * @param chartArea the chart area to clamp the indicator bounds within
 * @param activeElements the active elements to get bounds for.
 * @param styles the styles to apply to the indicator
 */
export function getBarIndicatorBounds(
  chartArea: ChartArea,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): IndicatorBounds {
  const bars = activeElements.map((el) => getGeometry(el));
  return getBounds(bars[0], chartArea, styles);
}

function getGeometry(activeElement: ActiveElement): BarGeometry {
  const bar = activeElement.element as BarElement;
  const props = bar.getProps(
    ['x', 'y', 'width', 'height', 'base', 'horizontal'],
    true,
  );

  return {
    x: props.x ?? 0,
    y: props.y ?? 0,
    width: props.width,
    height: props.height,
    base: props.base,
    horizontal: props.horizontal,
  };
}

function getBounds(
  bar: BarGeometry,
  chartArea: ChartArea,
  styles: IndicatorStyles,
): IndicatorBounds {
  let x: number, y: number, width: number, height: number;

  if (bar.horizontal) {
    // x = right edge, y = center, width = bar length, height = bar thickness
    x = bar.x - bar.width - styles.padding;
    y = bar.y - bar.height / 2 - styles.padding;
    width = bar.width + styles.padding * 2;
    height = bar.height + styles.padding * 2;
  } else {
    // x = center, y = top edge, width = bar thickness, height = bar length
    x = bar.x - bar.width / 2 - styles.padding;
    y = bar.y - styles.padding;
    width = bar.width + styles.padding * 2;
    height = bar.height + styles.padding * 2;
  }

  // Clamp only the axis-end so the indicator doesn't overflow into axes/scales,
  // while allowing the non-axis end to extend beyond the chart area.
  let clampedLeft: number;
  let clampedTop: number;
  let clampedRight: number;
  let clampedBottom: number;

  if (bar.horizontal) {
    // Axis is on the left → clamp left edge only.
    clampedLeft = Math.max(x, chartArea.left);
    clampedTop = y;
    clampedRight = x + width;
    clampedBottom = y + height;
  } else {
    // Axis is on the bottom → clamp bottom edge only.
    clampedLeft = x;
    clampedTop = y;
    clampedRight = x + width;
    clampedBottom = Math.min(y + height, chartArea.bottom);
  }

  return {
    x: clampedLeft,
    y: clampedTop,
    width: clampedRight - clampedLeft,
    height: clampedBottom - clampedTop,
  };
}

/** The geometry of a bar element */
interface BarGeometry {
  /** The x center */
  x: number;
  /** The y center */
  y: number;
  /** The width of the bar */
  width: number;
  /** The height of the bar */
  height: number;
  /**
   * The coordinate of the bar's base (the end attached to the axis).
   * For vertical bars, this is the y coordinate of the bottom edge;
   * For horizontal bars, this is the x coordinate of the left edge.
   */
  base: number;
  /** Is the bar horizontal */
  horizontal: boolean;
}

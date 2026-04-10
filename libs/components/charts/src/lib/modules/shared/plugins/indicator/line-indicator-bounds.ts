import { ActiveElement, PointElement } from 'chart.js';

import { IndicatorBounds, IndicatorStyles } from './indicator-types';

/**
 * Returns the geometry of an indicator box for the given active line elements.
 * @param activeElements the active elements to get bounds for.
 * @param styles the styles to apply to the indicator
 */
export function getLineIndicatorBounds(
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): IndicatorBounds {
  const points = activeElements.map((el) => getGeometry(el));
  return getBounds(points[0], styles);
}

function getGeometry(activeElement: ActiveElement): LinePointGeometry {
  const point = activeElement.element as PointElement;
  const props = point.getProps(['x', 'y'], true);

  return {
    x: props.x ?? 0,
    y: props.y ?? 0,
    radius: point.options.radius,
  };
}

function getBounds(
  point: LinePointGeometry,
  styles: IndicatorStyles,
): IndicatorBounds {
  const padding = styles.padding + 1.5;
  const radius = point.radius;
  const diameter = radius * 2;
  const diameterWithPadding = diameter + padding * 2;

  return {
    x: point.x - radius - padding,
    y: point.y - radius - padding,
    width: diameterWithPadding,
    height: diameterWithPadding,
  };
}

/** The geometry of a point element */
interface LinePointGeometry {
  /** The x center */
  x: number;
  /** The y center */
  y: number;
  /** The points radius */
  radius: number;
}

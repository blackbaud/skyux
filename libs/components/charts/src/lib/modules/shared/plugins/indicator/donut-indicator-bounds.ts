import type { ActiveElement, ArcElement } from 'chart.js';

import type { ArcIndicatorBounds } from './indicator-types';

/**
 * Returns the geometry of an indicator for the given active donut slice element.
 * @param activeElements the active elements to get bounds for.
 */
export function getDonutIndicatorBounds(
  activeElements: ActiveElement[],
): ArcIndicatorBounds {
  const geometry = getArcGeometry(activeElements[0]);
  return getBounds(geometry);
}

function getArcGeometry(activeElement: ActiveElement): ArcGeometry {
  const arc = activeElement.element as ArcElement;
  const props = arc.getProps(
    ['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius'],
    true,
  );

  return {
    x: props.x ?? 0,
    y: props.y ?? 0,
    startAngle: props.startAngle,
    endAngle: props.endAngle,
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
  };
}

function getBounds(slice: ArcGeometry): ArcIndicatorBounds {
  return {
    x: slice.x,
    y: slice.y,
    startAngle: slice.startAngle,
    endAngle: slice.endAngle,
    outerRadius: slice.outerRadius + Math.PI,
  };
}

/** Geometric properties of a donut chart. */
interface ArcGeometry {
  /** The x-coordinate of the arc's center point. */
  x: number;
  /** The y-coordinate of the arc's center point. */
  y: number;
  /** The angle (in radians) where the slice begins. */
  startAngle: number;
  /** The angle (in radians) where the slice ends. */
  endAngle: number;
  /** The radius of the inner edge of the donut slice. */
  innerRadius: number;
  /** The radius of the outer edge of the donut slice. */
  outerRadius: number;
}

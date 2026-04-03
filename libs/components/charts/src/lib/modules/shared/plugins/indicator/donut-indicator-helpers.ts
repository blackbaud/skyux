import type { ActiveElement, ArcElement } from 'chart.js';

/**
 * Returns the resolved geometry of the first active donut slice, or `null`
 * if there are no active elements.
 */
export function getDonutActiveElement(
  activeElements: ActiveElement[],
): DonutSliceGeometry | null {
  if (!activeElements.length) return null;

  // Donut charts should have a single dataset
  if (activeElements.length === 1) {
    const activeElement = activeElements[0];
    return getArcGeometry(activeElement);
  } else {
    throw new Error(
      'Multiple active points is not supported for donut indicators',
    );
  }
}

function getArcGeometry(activeElement: ActiveElement): DonutSliceGeometry {
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
    offset: arc.options.offset,
  };
}

/**
 * Translates the canvas context to account for a slice's hover offset so that
 * the indicator arc follows the slice when it is pushed outward.
 */
export function applyDonutSliceOffset(
  ctx: CanvasRenderingContext2D,
  el: DonutSliceGeometry,
): void {
  const offset = el.offset;
  if (offset === 0) return;
  const midAngle = (el.startAngle + el.endAngle) / 2;
  ctx.translate(Math.cos(midAngle) * offset, Math.sin(midAngle) * offset);
}

export interface DonutSliceGeometry {
  x: number;
  y: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  offset: number;
}

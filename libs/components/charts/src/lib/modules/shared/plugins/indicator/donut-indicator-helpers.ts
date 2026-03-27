import type { ActiveElement, ArcElement, Chart } from 'chart.js';

/**
 * Returns the resolved geometry of the first active donut slice, or `null`
 * if there are no active elements.
 */
export function getDonutActiveElement(
  chart: Chart,
  activeElements: ActiveElement[],
): DonutSliceGeometry | null {
  if (!activeElements.length) return null;

  // Donut charts have a single dataset; use the first active element.
  const el = activeElements[0];
  const meta = chart.getDatasetMeta(el.datasetIndex);
  const arc = meta.data[el.index] as ArcElement;
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

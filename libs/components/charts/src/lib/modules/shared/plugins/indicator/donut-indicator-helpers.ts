import type { ActiveElement, Chart } from 'chart.js';

/**
 * Returns the geometry of the first active donut slice, or `null` if there
 * are no active elements.
 */
export function getDonutActiveElement(
  chart: Chart,
  activeElements: ActiveElement[],
): DonutElementGeometry | null {
  if (!activeElements.length) return null;

  // Donut charts have a single dataset; use the first active element.
  const el = activeElements[0];
  const meta = chart.getDatasetMeta(el.datasetIndex);
  return meta.data[el.index] as unknown as DonutElementGeometry;
}

/**
 * Translates the canvas context to account for a slice's hover offset so that
 * the indicator arc follows the slice when it is pushed outward.
 */
export function applyDonutSliceOffset(
  ctx: CanvasRenderingContext2D,
  el: DonutElementGeometry,
): void {
  const offset = el.options?.offset ?? 0;
  if (offset === 0) return;
  const midAngle = (el.startAngle + el.endAngle) / 2;
  ctx.translate(Math.cos(midAngle) * offset, Math.sin(midAngle) * offset);
}

interface DonutElementGeometry {
  x: number;
  y: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  options?: { offset?: number };
}

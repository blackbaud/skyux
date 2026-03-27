import { ActiveElement, Chart } from 'chart.js';

import { IndicatorBounds, IndicatorStyles } from './indicator-types';

export function getLineIndicatorBounds(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): IndicatorBounds {
  const pointElements = activeElements.map((el) => {
    const meta = chart.getDatasetMeta(el.datasetIndex);
    return meta.data[el.index] as unknown as PointElementGeometry;
  });

  return getSinglePointBounds(pointElements[0], styles);
}

function getSinglePointBounds(
  point: PointElementGeometry,
  styles: IndicatorStyles,
): IndicatorBounds {
  const padding = styles.padding + Math.PI / 2;
  const radius = point.options?.radius ?? 0;
  const diameter = radius * 2;
  const diameterWithPadding = diameter + padding * 2;

  return {
    x: point.x - radius - padding,
    y: point.y - radius - padding,
    width: diameterWithPadding,
    height: diameterWithPadding,
  };
}

interface PointElementGeometry {
  x: number;
  y: number;
  options?: { radius?: number };
}

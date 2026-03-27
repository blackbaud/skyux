import { ActiveElement, Chart, PointElement } from 'chart.js';

import { IndicatorBounds, IndicatorStyles } from './indicator-types';

export function getLineIndicatorBounds(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): IndicatorBounds {
  const points = activeElements.map((el) => getPointGeometry(chart, el));

  return getSinglePointBounds(points[0], styles);
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

function getPointGeometry(
  chart: Chart,
  element: ActiveElement,
): LinePointGeometry {
  const meta = chart.getDatasetMeta(element.datasetIndex);
  const point = meta.data[element.index] as PointElement;
  const props = point.getProps(['x', 'y'], true);

  return {
    x: props.x ?? 0,
    y: props.y ?? 0,
    radius: point.options.radius,
  };
}

function getSinglePointBounds(
  point: LinePointGeometry,
  styles: IndicatorStyles,
): IndicatorBounds {
  const padding = styles.padding + Math.PI / 2;
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

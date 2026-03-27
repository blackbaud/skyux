import type { ActiveElement, Chart, ChartArea } from 'chart.js';

import { IndicatorBounds, IndicatorStyles } from './indicator-types';

export function getBarIndicatorBounds(
  chart: Chart,
  activeElements: ActiveElement[],
  styles: IndicatorStyles,
): IndicatorBounds {
  const config = chart.config;
  const isHorizontal = config.options?.indexAxis === 'y';

  const barElements = activeElements.map((el) => {
    const meta = chart.getDatasetMeta(el.datasetIndex);
    return meta.data[el.index] as unknown as BarElementGeometry;
  });

  return getSingleBarBounds(
    barElements[0],
    isHorizontal,
    chart.chartArea,
    styles,
  );
}

function getSingleBarBounds(
  bar: BarElementGeometry,
  isHorizontal: boolean,
  chartArea: ChartArea,
  styles: IndicatorStyles,
): IndicatorBounds {
  let x: number, y: number, width: number, height: number;

  if (isHorizontal) {
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

  if (isHorizontal) {
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

interface BarElementGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  base: number;
}

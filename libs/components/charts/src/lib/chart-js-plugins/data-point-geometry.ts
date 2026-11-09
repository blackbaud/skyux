import {
  BarElement,
  type Chart,
  type Element as ChartJsElement,
  type PointElement,
} from 'chart.js';

import { type SkyChartDataPoint } from '../chart-data-points/chart-data-point';
import { type SkyChartDataPointSeries } from '../chart-data-points/chart-data-point-series';
import { type SkyChartTable } from '../chart-table/chart-table';

import { type SkyChartJsDataPointIndex } from './chart-js-data-point-index';

/**
 * Builds a stable key that identifies a data point across re-measurements.
 */
export function toDataPointKey({
  datasetIndex,
  index,
}: SkyChartJsDataPointIndex): string {
  return `${datasetIndex}-${index}`;
}

/**
 * Measures the area a drawn data point occupies on the canvas, and its anchor
 * point: the end of a bar or the center of a line point. Final property values
 * are used so the geometry matches where an animating element comes to rest.
 */
export function getElementGeometry(element: ChartJsElement): {
  left: number;
  top: number;
  width: number;
  height: number;
  x: number;
  y: number;
} {
  if (element instanceof BarElement) {
    // Coordinates are only null for gaps, which are never measured.
    const { x, y, base, horizontal, width, height } = element.getProps(
      ['x', 'y', 'base', 'horizontal', 'width', 'height'],
      true,
    ) as {
      x: number;
      y: number;
      base: number;
      horizontal: boolean;
      width: number;
      height: number;
    };

    return {
      x,
      y,
      ...(horizontal
        ? {
            left: Math.min(x, base),
            top: y - height / 2,
            width: Math.abs(x - base),
            height,
          }
        : {
            left: x - width / 2,
            top: Math.min(y, base),
            width,
            height: Math.abs(y - base),
          }),
    };
  }

  const point = element as PointElement;
  const { x, y } = point.getCenterPoint(true);
  const radius = point.options.hoverRadius;

  return {
    left: x - radius,
    top: y - radius,
    width: radius * 2,
    height: radius * 2,
    x,
    y,
  };
}

/**
 * Measures every visible data point of a laid-out chart, grouped by series,
 * and names each one from the chart's formatted data table. Gaps (null values)
 * and hidden series draw nothing, so they are omitted.
 */
export function measureDataPoints(
  chart: Chart,
  table: SkyChartTable | undefined,
  horizontal: boolean,
): SkyChartDataPointSeries[] {
  const seriesCount = chart.data.datasets.length;
  const series: SkyChartDataPointSeries[] = [];

  chart.data.datasets.forEach((dataset, datasetIndex) => {
    if (!chart.isDatasetVisible(datasetIndex)) {
      return;
    }

    const tableSeries = table?.series[datasetIndex];
    const seriesLabelText = tableSeries?.label ?? '';
    const dataPoints: SkyChartDataPoint[] = [];

    chart.getDatasetMeta(datasetIndex).data.forEach((element, index) => {
      if (dataset.data[index] === null || dataset.data[index] === undefined) {
        return;
      }

      const category = String(table?.categories[index] ?? '');
      const { x, y, ...bounds } = getElementGeometry(element);

      dataPoints.push({
        datasetIndex,
        index,
        key: toDataPointKey({ datasetIndex, index }),
        category,
        seriesLabelText,
        accessibleName: `${category}, ${tableSeries?.values[index] ?? ''}. ${seriesLabelText}.`,
        ...bounds,
        plotX: horizontal ? y : x,
        plotY: horizontal ? x : y,
      });
    });

    series.push({
      datasetIndex,
      labelText: seriesLabelText,
      seriesCount,
      valueCount: dataset.data.length,
      dataPoints,
    });
  });

  return series;
}

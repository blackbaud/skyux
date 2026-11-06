import { expect } from '@skyux-sdk/testing';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartConfiguration,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';

import { type SkyChartTable } from '../chart-table/chart-table';

import {
  getElementGeometry,
  measureDataPoints,
  toDataPointKey,
} from './data-point-geometry';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
);

// Chart.js's element types omit the bar geometry it sets at runtime.
type BarProbe = {
  x: number;
  y: number;
  base: number;
  width: number;
  height: number;
};

const TABLE: SkyChartTable = {
  categoryLabel: 'Letter',
  categories: ['a', 'b', 'c'],
  series: [
    { label: 'First', values: ['1', '2', '3'] },
    { label: 'Second', values: ['4', '', '6'] },
  ],
};

describe('Data point geometry', () => {
  let container: HTMLDivElement;
  let chart: Chart | undefined;

  function createChart(
    overrides: {
      type?: 'bar' | 'line';
      indexAxis?: 'x' | 'y';
      hidden?: boolean;
    } = {},
  ): Chart {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    chart = new Chart(canvas, {
      type: overrides.type ?? 'bar',
      data: {
        labels: ['a', 'b', 'c'],
        datasets: [
          { label: 'First', data: [1, 2, 3], hidden: overrides.hidden },
          { label: 'Second', data: [4, null, 6] },
        ],
      },
      options: {
        animation: false,
        maintainAspectRatio: false,
        indexAxis: overrides.indexAxis,
      },
    } as ChartConfiguration);

    return chart;
  }

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '300px';
    document.body.appendChild(container);
  });

  afterEach(() => {
    chart?.destroy();
    chart = undefined;
    container.remove();
  });

  describe('toDataPointKey', () => {
    it('should combine the dataset and data indexes', () => {
      expect(toDataPointKey({ datasetIndex: 1, index: 2 })).toBe('1-2');
    });
  });

  describe('getElementGeometry', () => {
    it('should measure a vertical bar from its value to its base', () => {
      const bar = createChart().getDatasetMeta(0).data[1];
      const probe = bar as unknown as BarProbe;

      expect(getElementGeometry(bar)).toEqual({
        left: probe.x - probe.width / 2,
        top: probe.y,
        width: probe.width,
        height: probe.base - probe.y,
        x: probe.x,
        y: probe.y,
      });
    });

    it('should measure a horizontal bar from its base to its value', () => {
      const bar = createChart({ indexAxis: 'y' }).getDatasetMeta(0).data[1];
      const probe = bar as unknown as BarProbe;

      expect(getElementGeometry(bar)).toEqual({
        left: probe.base,
        top: probe.y - probe.height / 2,
        width: probe.x - probe.base,
        height: probe.height,
        x: probe.x,
        y: probe.y,
      });
    });

    it('should measure a line point by its hover radius', () => {
      const point = createChart({ type: 'line' }).getDatasetMeta(0).data[1];
      const radius = (point.options as { hoverRadius: number }).hoverRadius;

      expect(getElementGeometry(point)).toEqual({
        left: point.x - radius,
        top: point.y - radius,
        width: radius * 2,
        height: radius * 2,
        x: point.x,
        y: point.y,
      });
    });
  });

  describe('measureDataPoints', () => {
    it('should measure each visible data point, grouped by series, skipping gaps', () => {
      const series = measureDataPoints(createChart(), TABLE, false);

      expect(
        series.map(({ datasetIndex, labelText, seriesCount, valueCount }) => ({
          datasetIndex,
          labelText,
          seriesCount,
          valueCount,
        })),
      ).toEqual([
        { datasetIndex: 0, labelText: 'First', seriesCount: 2, valueCount: 3 },
        {
          datasetIndex: 1,
          labelText: 'Second',
          seriesCount: 2,
          valueCount: 3,
        },
      ]);
      expect(series[1].dataPoints.map((dataPoint) => dataPoint.key)).toEqual([
        '1-0',
        '1-2',
      ]);
    });

    it('should name each data point from the data table, like Highcharts', () => {
      const [first] = measureDataPoints(createChart(), TABLE, false);

      expect(first.dataPoints[1]).toEqual(
        jasmine.objectContaining({
          datasetIndex: 0,
          index: 1,
          category: 'b',
          seriesLabelText: 'First',
          accessibleName: 'b, 2. First.',
        }),
      );
    });

    it('should leave the names empty before the data table is published', () => {
      const [first] = measureDataPoints(createChart(), undefined, false);

      expect(first.labelText).toBe('');
      expect(first.dataPoints[0].accessibleName).toBe(', . .');
    });

    it('should skip hidden series', () => {
      const series = measureDataPoints(
        createChart({ hidden: true }),
        TABLE,
        false,
      );

      expect(series.map((chartSeries) => chartSeries.labelText)).toEqual([
        'Second',
      ]);
    });

    it('should position each data point by its element geometry', () => {
      const measuredChart = createChart();
      const [first] = measureDataPoints(measuredChart, TABLE, false);
      const { x, y, ...bounds } = getElementGeometry(
        measuredChart.getDatasetMeta(0).data[1],
      );

      expect(first.dataPoints[1]).toEqual(
        jasmine.objectContaining({ ...bounds, plotX: x, plotY: y }),
      );
    });

    it('should measure plot positions along the category axis of a horizontal chart', () => {
      const measuredChart = createChart({ indexAxis: 'y' });
      const [first] = measureDataPoints(measuredChart, TABLE, true);
      const { x, y } = getElementGeometry(
        measuredChart.getDatasetMeta(0).data[1],
      );

      expect(first.dataPoints[1].plotX).toBe(y);
      expect(first.dataPoints[1].plotY).toBe(x);
    });
  });
});

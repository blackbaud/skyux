import { expect } from '@skyux-sdk/testing';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartConfiguration,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
} from 'chart.js';

import { type SkyChartTable } from '../chart-table/chart-table';

import {
  getArcProps,
  getElementGeometry,
  measureDataPoints,
  toDataPointKey,
} from './data-point-geometry';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PieController,
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

    describe('pie slices', () => {
      function createPie(data: number[], cutout: string | number): Chart {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        chart = new Chart(canvas, {
          type: 'pie',
          data: { labels: data.map(String), datasets: [{ data }] },
          options: { animation: false, maintainAspectRatio: false, cutout },
        });

        return chart;
      }

      it('should measure a slice by the bounding box of its sector', () => {
        // Chart.js starts at 12 o'clock, so the first quarter spans from the
        // center up to the top and right edges of the pie.
        const arc = createPie([1, 3], 0).getDatasetMeta(0)
          .data[0] as ArcElement;
        const { x, y, outerRadius } = getArcProps(arc);

        const geometry = getElementGeometry(arc);

        expect(geometry.left).toBeCloseTo(x, 5);
        expect(geometry.top).toBeCloseTo(y - outerRadius, 5);
        expect(geometry.width).toBeCloseTo(outerRadius, 5);
        expect(geometry.height).toBeCloseTo(outerRadius, 5);
      });

      it('should include every edge a slice sweeps past', () => {
        const arc = createPie([3, 1], 0).getDatasetMeta(0)
          .data[0] as ArcElement;
        const { x, y, outerRadius } = getArcProps(arc);

        const geometry = getElementGeometry(arc);

        // Three quarters from 12 o'clock reach the right, bottom, and left
        // edges, and the top edge where the slice starts.
        expect(geometry.left).toBeCloseTo(x - outerRadius, 5);
        expect(geometry.top).toBeCloseTo(y - outerRadius, 5);
        expect(geometry.width).toBeCloseTo(outerRadius * 2, 5);
        expect(geometry.height).toBeCloseTo(outerRadius * 2, 5);
      });

      it('should exclude the hollow center of a donut slice', () => {
        // The first slice spans 60 degrees clockwise from 12 o'clock, so the
        // inner edge, not the center, bounds the bottom of the slice.
        const arc = createPie([1, 5], '50%').getDatasetMeta(0)
          .data[0] as ArcElement;
        const { x, y, innerRadius, outerRadius } = getArcProps(arc);

        const geometry = getElementGeometry(arc);

        expect(innerRadius).toBeGreaterThan(0);
        expect(geometry.left).toBeCloseTo(x, 5);
        expect(geometry.top).toBeCloseTo(y - outerRadius, 5);
        expect(geometry.height).toBeCloseTo(outerRadius - innerRadius / 2, 5);
        expect(geometry.width).toBeCloseTo(
          outerRadius * Math.cos(Math.PI / 6),
          5,
        );
      });

      it('should anchor a slice at its centroid, which is inside the slice', () => {
        const arc = createPie([3, 1], 0).getDatasetMeta(0)
          .data[0] as ArcElement;
        const { x, y } = getElementGeometry(arc);

        expect({ x, y }).toEqual(arc.tooltipPosition(true));
        expect(arc.inRange(x, y, true)).toBeTrue();
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

    it('should mark the series the data table emphasizes', () => {
      const [first, second] = measureDataPoints(
        createChart(),
        {
          ...TABLE,
          series: [{ ...TABLE.series[0], emphasized: true }, TABLE.series[1]],
        },
        false,
      );

      expect(first.emphasized).toBe(true);
      expect(second.emphasized).toBeUndefined();
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

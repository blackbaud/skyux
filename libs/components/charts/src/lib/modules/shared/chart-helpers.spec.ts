import { SkyLibResourcesService } from '@skyux/i18n';

import { Chart, LegendItem } from 'chart.js';
import { of } from 'rxjs';

import {
  buildChartSummary,
  getChartType,
  getDatasetType,
  getLegendItems,
  isDatasetType,
  isDonutChart,
  parseCategories,
} from './chart-helpers';
import { SkyChartAxisConfig } from './types/axis-types';
import { SkyChartDataPoint } from './types/chart-data-point';
import { SkyChartSeries } from './types/chart-series';

describe('chart-helpers', () => {
  describe('getDatasetType', () => {
    it('should return the dataset type when explicitly set', () => {
      const chart = createMockChart('bar');
      const dataset = { type: 'line' as const, data: [] };
      expect(getDatasetType(chart, dataset)).toBe('line');
    });

    it('should fall back to the chart root type when dataset type is not set', () => {
      const chart = createMockChart('bar');
      const dataset = { data: [] };
      expect(getDatasetType(chart, dataset)).toBe('bar');
    });
  });

  describe('isDatasetType', () => {
    it('should return true when dataset type matches', () => {
      const chart = createMockChart('line');
      const dataset = { data: [] };
      expect(isDatasetType(chart, dataset, 'line')).toBeTrue();
    });

    it('should return false when dataset type does not match', () => {
      const chart = createMockChart('bar');
      const dataset = { data: [] };
      expect(isDatasetType(chart, dataset, 'line')).toBeFalse();
    });
  });

  describe('getChartType', () => {
    it('should return the chart type from a valid config', () => {
      const chart = createMockChart('bar');
      expect(getChartType(chart)).toBe('bar');
    });

    it('should throw when config has no type property', () => {
      const chart = { config: {} } as Chart;
      expect(() => getChartType(chart)).toThrowError('Unknown chart type');
    });

    it('should throw when config type is not a string', () => {
      const chart = { config: { type: 42 } } as unknown as Chart;
      expect(() => getChartType(chart)).toThrowError('Unknown chart type');
    });
  });

  describe('isDonutChart', () => {
    it('should return true for doughnut charts', () => {
      const chart = createMockChart('doughnut');
      expect(isDonutChart(chart)).toBeTrue();
    });

    it('should return false for non-doughnut charts', () => {
      const chart = createMockChart('bar');
      expect(isDonutChart(chart)).toBeFalse();
    });
  });

  describe('parseCategories', () => {
    it('should return unique categories from series', () => {
      const series: SkyChartSeries<SkyChartDataPoint>[] = [
        {
          id: 1,
          labelText: 'Series 1',
          data: [
            { id: 1, labelText: 'A', category: 'Q1' },
            { id: 2, labelText: 'B', category: 'Q2' },
          ],
        },
        {
          id: 2,
          labelText: 'Series 2',
          data: [
            { id: 3, labelText: 'C', category: 'Q1' },
            { id: 4, labelText: 'D', category: 'Q3' },
          ],
        },
      ];

      expect(parseCategories(series)).toEqual(['Q1', 'Q2', 'Q3']);
    });

    it('should return an empty array when series is empty', () => {
      expect(parseCategories([])).toEqual([]);
    });

    it('should return an empty array when all series have no data', () => {
      const series: SkyChartSeries<SkyChartDataPoint>[] = [
        { id: 1, labelText: 'Series 1', data: [] },
      ];
      expect(parseCategories(series)).toEqual([]);
    });
  });

  describe('getLegendItems', () => {
    it('should return an empty array when chart is undefined', () => {
      expect(
        getLegendItems({ chart: undefined, legendMode: 'series', labels: [] }),
      ).toEqual([]);
    });

    it('should return an empty array when generateLabels is not defined', () => {
      const chart = {
        ...createMockChart('bar'),
        options: { plugins: { legend: { labels: {} } } },
        isDatasetVisible: () => true,
        getDataVisibility: () => true,
      } as unknown as Chart;

      const result = getLegendItems({
        chart,
        legendMode: 'series',
        labels: ['Series 1'],
      });

      expect(result).toEqual([]);
    });

    it('should map legend items in series mode using datasetIndex', () => {
      const legendItems: LegendItem[] = [
        { text: '', datasetIndex: 0, index: 0, fillStyle: '#ff0000' },
        { text: '', datasetIndex: 1, index: 1, fillStyle: '#00ff00' },
      ];

      const chart = {
        ...createMockChart('bar'),
        options: {
          plugins: {
            legend: {
              labels: { generateLabels: () => legendItems },
            },
          },
        },
        isDatasetVisible: (i: number) => i === 0,
        getDataVisibility: () => false,
      } as unknown as Chart;

      const result = getLegendItems({
        chart,
        legendMode: 'series',
        labels: ['Series A', 'Series B'],
      });

      expect(result).toEqual([
        {
          datasetIndex: 0,
          index: 0,
          isVisible: true,
          labelText: 'Series A',
          seriesColor: '#ff0000',
        },
        {
          datasetIndex: 1,
          index: 1,
          isVisible: false,
          labelText: 'Series B',
          seriesColor: '#00ff00',
        },
      ]);
    });

    it('should map legend items in category mode using index', () => {
      const legendItems: LegendItem[] = [
        { text: '', datasetIndex: 0, index: 0, fillStyle: '#aabbcc' },
        { text: '', datasetIndex: 0, index: 1, fillStyle: '#ddeeff' },
      ];

      const chart = {
        ...createMockChart('doughnut'),
        options: {
          plugins: {
            legend: {
              labels: { generateLabels: () => legendItems },
            },
          },
        },
        isDatasetVisible: () => true,
        getDataVisibility: (i: number) => i === 1,
      } as unknown as Chart;

      const result = getLegendItems({
        chart,
        legendMode: 'category',
        labels: ['Q1', 'Q2'],
      });

      expect(result).toEqual([
        {
          datasetIndex: 0,
          index: 0,
          isVisible: false,
          labelText: 'Q1',
          seriesColor: '#aabbcc',
        },
        {
          datasetIndex: 0,
          index: 1,
          isVisible: true,
          labelText: 'Q2',
          seriesColor: '#ddeeff',
        },
      ]);
    });

    it('should default fillStyle to "transparent" when not defined', () => {
      const legendItems: LegendItem[] = [
        { text: '', datasetIndex: 0, index: 0 },
      ];

      const chart = {
        ...createMockChart('bar'),
        options: {
          plugins: {
            legend: {
              labels: { generateLabels: () => legendItems },
            },
          },
        },
        isDatasetVisible: () => true,
        getDataVisibility: () => true,
      } as unknown as Chart;

      const result = getLegendItems({
        chart,
        legendMode: 'series',
        labels: ['Series A'],
      });

      expect(result[0].seriesColor).toBe('transparent');
    });

    it('should default datasetIndex and index to 0 when undefined on legendItem', () => {
      const legendItems: LegendItem[] = [{ text: '' } as LegendItem];

      const chart = {
        ...createMockChart('bar'),
        options: {
          plugins: {
            legend: {
              labels: { generateLabels: () => legendItems },
            },
          },
        },
        isDatasetVisible: () => true,
        getDataVisibility: () => true,
      } as unknown as Chart;

      const result = getLegendItems({
        chart,
        legendMode: 'series',
        labels: ['Series A'],
      });

      expect(result[0].datasetIndex).toBe(0);
      expect(result[0].index).toBe(0);
    });
  });

  describe('buildChartSummary', () => {
    let mockResourcesService: jasmine.SpyObj<SkyLibResourcesService>;

    beforeEach(() => {
      mockResourcesService = jasmine.createSpyObj('SkyLibResourcesService', [
        'getString',
      ]);
      mockResourcesService.getString.and.callFake(
        (key: string, ...args: unknown[]) => {
          if (key === 'chart.summary.category_axis') {
            return of(`Category axis: ${args[0]}`);
          }
          if (key === 'chart.summary.measure_axis') {
            return of(`Measure axis: ${args[0]}`);
          }
          return of(key);
        },
      );
    });

    it('should build summary with all parameters', (done) => {
      const categoryAxis: SkyChartAxisConfig = {
        labelText: 'Quarter',
      };
      const measureAxis: SkyChartAxisConfig = {
        labelText: 'Revenue',
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: 'Sales Chart',
        subtitleText: 'Quarterly Results',
        chartTypeDescription$: of('Bar chart'),
        categoryAxis,
        measureAxis,
      }).subscribe((result) => {
        expect(result).toBe(
          'Sales Chart Bar chart Quarterly Results Category axis: Quarter Measure axis: Revenue',
        );
        done();
      });
    });

    it('should build summary without headingText', (done) => {
      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: 'Quarterly Results',
        chartTypeDescription$: of('Bar chart'),
      }).subscribe((result) => {
        expect(result).toBe('Bar chart Quarterly Results');
        done();
      });
    });

    it('should build summary without subtitleText', (done) => {
      buildChartSummary({
        resources: mockResourcesService,
        headingText: 'Sales Chart',
        subtitleText: undefined,
        chartTypeDescription$: of('Bar chart'),
      }).subscribe((result) => {
        expect(result).toBe('Sales Chart Bar chart');
        done();
      });
    });

    it('should build summary with only chart type description', (done) => {
      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Donut chart'),
      }).subscribe((result) => {
        expect(result).toBe('Donut chart');
        done();
      });
    });

    it('should build summary with categoryAxis with string labelText', (done) => {
      const categoryAxis: SkyChartAxisConfig = {
        labelText: 'Month',
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Line chart'),
        categoryAxis,
      }).subscribe((result) => {
        expect(result).toBe('Line chart Category axis: Month');
        done();
      });
    });

    it('should build summary with categoryAxis with array labelText', (done) => {
      const categoryAxis: SkyChartAxisConfig = {
        labelText: ['Quarter', 'Year'],
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Bar chart'),
        categoryAxis,
      }).subscribe((result) => {
        expect(result).toBe('Bar chart Category axis: Quarter,Year');
        done();
      });
    });

    it('should build summary with measureAxis with string labelText', (done) => {
      const measureAxis: SkyChartAxisConfig = {
        labelText: 'Sales',
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Bar chart'),
        measureAxis,
      }).subscribe((result) => {
        expect(result).toBe('Bar chart Measure axis: Sales');
        done();
      });
    });

    it('should build summary with measureAxis with array labelText', (done) => {
      const measureAxis: SkyChartAxisConfig = {
        labelText: ['Revenue', 'USD'],
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Line chart'),
        measureAxis,
      }).subscribe((result) => {
        expect(result).toBe('Line chart Measure axis: Revenue,USD');
        done();
      });
    });

    it('should build summary with both axes', (done) => {
      const categoryAxis: SkyChartAxisConfig = {
        labelText: 'Quarter',
      };
      const measureAxis: SkyChartAxisConfig = {
        labelText: 'Revenue',
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Bar chart'),
        categoryAxis,
        measureAxis,
      }).subscribe((result) => {
        expect(result).toBe(
          'Bar chart Category axis: Quarter Measure axis: Revenue',
        );
        done();
      });
    });

    it('should ignore categoryAxis without labelText', (done) => {
      const categoryAxis: SkyChartAxisConfig = {
        labelText: undefined,
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Bar chart'),
        categoryAxis,
      }).subscribe((result) => {
        expect(result).toBe('Bar chart');
        done();
      });
    });

    it('should ignore measureAxis without labelText', (done) => {
      const measureAxis: SkyChartAxisConfig = {
        labelText: undefined,
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Line chart'),
        measureAxis,
      }).subscribe((result) => {
        expect(result).toBe('Line chart');
        done();
      });
    });

    it('should ignore undefined categoryAxis', (done) => {
      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Bar chart'),
        categoryAxis: undefined,
      }).subscribe((result) => {
        expect(result).toBe('Bar chart');
        done();
      });
    });

    it('should ignore undefined measureAxis', (done) => {
      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Line chart'),
        measureAxis: undefined,
      }).subscribe((result) => {
        expect(result).toBe('Line chart');
        done();
      });
    });

    it('should handle empty string labelText in categoryAxis', (done) => {
      const categoryAxis: SkyChartAxisConfig = {
        labelText: '',
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Bar chart'),
        categoryAxis,
      }).subscribe((result) => {
        expect(result).toBe('Bar chart');
        done();
      });
    });

    it('should handle empty string labelText in measureAxis', (done) => {
      const measureAxis: SkyChartAxisConfig = {
        labelText: '',
      };

      buildChartSummary({
        resources: mockResourcesService,
        headingText: undefined,
        subtitleText: undefined,
        chartTypeDescription$: of('Line chart'),
        measureAxis,
      }).subscribe((result) => {
        expect(result).toBe('Line chart');
        done();
      });
    });
  });
});

// #region Test Helpers
function createMockChart(type: string): Chart {
  return {
    config: { type },
    data: { datasets: [] },
    options: {},
  } as unknown as Chart;
}
// #endregion

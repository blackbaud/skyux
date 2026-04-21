import { Chart, LegendItem } from 'chart.js';

import {
  getAxisLabelText,
  getChartType,
  getDatasetType,
  getLegendItems,
  isDatasetType,
  isDonutChart,
  parseCategories,
} from './chart-helpers';
import { SkyChartDataPoint } from './types/chart-data-point';
import { SkyChartSeries } from './types/chart-series';

describe('chart-helpers', () => {
  describe('getAxisLabelText', () => {
    it('should return undefined when config is undefined', () => {
      expect(getAxisLabelText(undefined)).toBeUndefined();
    });

    it('should return undefined when config.labelText is undefined', () => {
      expect(getAxisLabelText({})).toBeUndefined();
    });

    it('should return undefined when config.labelText is an empty string', () => {
      expect(getAxisLabelText({ labelText: '' })).toBeUndefined();
    });

    it('should return the string when labelText is a string', () => {
      expect(getAxisLabelText({ labelText: 'Revenue' })).toBe('Revenue');
    });

    it('should join array elements with comma when labelText is an array', () => {
      expect(getAxisLabelText({ labelText: ['Line 1', 'Line 2'] })).toBe(
        'Line 1,Line 2',
      );
    });
  });

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

import type { ActiveElement, Chart } from 'chart.js';

import type { FocusedElement } from './navigation-strategy';
import { RadialNavigationStrategy } from './radial-navigation-strategy';

describe('RadialNavigationStrategy', () => {
  describe('navigate', () => {
    it('should move to the next segment on ArrowRight', () => {
      const chart = createMockChart();
      const strategy = new RadialNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowRight', current);

      expect(result).toEqual({ datasetIndex: 0, index: 1 });
    });

    it('should move to the next segment on ArrowDown', () => {
      const chart = createMockChart();
      const strategy = new RadialNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowDown', current);

      expect(result).toEqual({ datasetIndex: 0, index: 1 });
    });

    it('should move to the previous segment on ArrowLeft', () => {
      const chart = createMockChart();
      const strategy = new RadialNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 2 };

      const result = strategy.navigate('ArrowLeft', current);

      expect(result).toEqual({ datasetIndex: 0, index: 1 });
    });

    it('should move to the previous segment on ArrowUp', () => {
      const chart = createMockChart();
      const strategy = new RadialNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 2 };

      const result = strategy.navigate('ArrowUp', current);

      expect(result).toEqual({ datasetIndex: 0, index: 1 });
    });

    it('should wrap forward from the last segment to the first on ArrowRight', () => {
      const chart = createMockChart();
      const strategy = new RadialNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 3 };

      const result = strategy.navigate('ArrowRight', current);

      expect(result).toEqual({ datasetIndex: 0, index: 0 });
    });

    it('should wrap backward from the first segment to the last on ArrowLeft', () => {
      const chart = createMockChart();
      const strategy = new RadialNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowLeft', current);

      expect(result).toEqual({ datasetIndex: 0, index: 3 });
    });

    it('should return current when datasets array is empty (no datasets[0])', () => {
      const chart = {
        config: { type: 'doughnut', options: {} },
        data: { datasets: [], labels: [] },
        getDatasetMeta: jasmine
          .createSpy('getDatasetMeta')
          .and.returnValue({ data: [] }),
      } as unknown as Chart;
      const strategy = new RadialNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowRight', current);

      expect(result).toEqual(current);
    });

    it('should return current when the data array is empty', () => {
      const chart = createMockChart({ data: [] });
      const strategy = new RadialNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowRight', current);

      expect(result).toEqual(current);
    });
  });

  describe('getTooltipElements', () => {
    it('should return the focused segment as the single tooltip element', () => {
      const chart = createMockChart();
      const strategy = new RadialNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 2 };

      const result = strategy.getTooltipElements(chart, focused);

      expect(result.length).toBe(1);
      expect(result[0].datasetIndex).toBe(0);
      expect(result[0].index).toBe(2);
    });

    it('should return empty array when the data element does not exist', () => {
      const chart = createMockChart({ data: [] });
      const strategy = new RadialNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.getTooltipElements(chart, focused);

      expect(result.length).toBe(0);
    });
  });

  describe('describeElement', () => {
    it('should describe the focused segment with correct values', () => {
      const chart = createMockChart({
        data: [10, 20, 30, 40],
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        label: 'Sales',
      });
      const strategy = new RadialNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 1 };

      const result = strategy.describeElement(chart, focused);

      expect(result.seriesLabel).toBe('Sales');
      expect(result.seriesIndex).toBe(1);
      expect(result.totalSeries).toBe(1);
      expect(result.categoryLabel).toBe('Q2');
      expect(result.value).toBe('20');
      expect(result.index).toBe(2);
      expect(result.total).toBe(4);
    });

    it('should return empty strings and zero total when datasetIndex is out of bounds', () => {
      const chart = createMockChart({
        data: [10, 20],
        labels: ['X', 'Y'],
        label: 'Data',
      });
      const strategy = new RadialNavigationStrategy(chart);
      // datasetIndex 99 is out of bounds — all ?? fallbacks should fire
      const focused: FocusedElement = { datasetIndex: 99, index: 0 };

      const result = strategy.describeElement(chart, focused);

      expect(result.seriesLabel).toBe('');
      expect(result.categoryLabel).toBe('X');
      expect(result.value).toBe('');
      expect(result.total).toBe(0);
    });

    it('should fall back to dataset label when segment label is missing', () => {
      const chart = createMockChart({
        data: [5],
        labels: [],
        label: 'Total',
      });
      const strategy = new RadialNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.describeElement(chart, focused);

      expect(result.categoryLabel).toBe('Total');
    });
  });
});

// #region Test Helpers
function createMockDataElement(): ActiveElement['element'] {
  return {} as ActiveElement['element'];
}

function createMockChart(
  options: {
    data?: unknown[];
    label?: string;
    labels?: string[];
  } = {},
): Chart {
  const data = options.data ?? [10, 20, 30, 40];
  const labels = options.labels ?? ['A', 'B', 'C', 'D'];

  const getDatasetMeta = jasmine
    .createSpy('getDatasetMeta')
    .and.callFake(() => ({
      data: data.map(() => createMockDataElement()),
    }));

  return {
    config: { type: 'doughnut', options: {} },
    data: {
      datasets: [{ data, label: options.label ?? 'Dataset' }],
      labels,
    },
    getDatasetMeta,
  } as unknown as Chart;
}
// #endregion

import type { ActiveElement, Chart } from 'chart.js';

import { CartesianNavigationStrategy } from './cartesian-navigation-strategy';
import type { FocusedElement } from './navigation-strategy';

describe('CartesianNavigationStrategy', () => {
  describe('navigate (vertical chart, indexAxis=x)', () => {
    it('should move to the next data point on ArrowRight', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowRight', current);

      expect(result).toEqual({ datasetIndex: 0, index: 1 });
    });

    it('should move to the previous data point on ArrowLeft', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 2 };

      const result = strategy.navigate('ArrowLeft', current);

      expect(result).toEqual({ datasetIndex: 0, index: 1 });
    });

    it('should clamp at the last data point when ArrowRight is pressed at the end', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 2 };

      const result = strategy.navigate('ArrowRight', current);

      expect(result).toEqual({ datasetIndex: 0, index: 2 });
    });

    it('should clamp at the first data point when ArrowLeft is pressed at the start', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowLeft', current);

      expect(result).toEqual({ datasetIndex: 0, index: 0 });
    });

    it('should move to the next series on ArrowDown', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowDown', current);

      expect(result).toEqual({ datasetIndex: 1, index: 0 });
    });

    it('should move to the previous series on ArrowUp', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 1, index: 0 };

      const result = strategy.navigate('ArrowUp', current);

      expect(result).toEqual({ datasetIndex: 0, index: 0 });
    });

    it('should wrap to the next series when at the last series', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 1, index: 0 };

      const result = strategy.navigate('ArrowDown', current);

      expect(result).toEqual({ datasetIndex: 0, index: 0 });
    });

    it('should wrap to the previous series when at the first series', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowUp', current);

      expect(result).toEqual({ datasetIndex: 1, index: 0 });
    });

    it('should clamp index when switching to a shorter series', () => {
      const chart = createMockChart({
        datasets: [
          { data: [1, 2, 3], label: 'Series A' },
          { data: [4], label: 'Series B' },
        ],
      });
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 2 };

      const result = strategy.navigate('ArrowDown', current);

      expect(result).toEqual({ datasetIndex: 1, index: 0 });
    });

    it('should return current when the chart has no datasets (datasetCount === 0)', () => {
      const chart = createMockChart({ datasets: [] });
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowDown', current);

      expect(result).toEqual(current);
    });

    it('should return current when the focused datasetIndex is out of bounds (newIndex < 0)', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      // Out-of-bounds datasetIndex causes #getDataLength to return 0 via ?? 0,
      // making maxIndex = -1, so newIndex = -1 which triggers the guard.
      const current: FocusedElement = { datasetIndex: 99, index: 0 };

      const result = strategy.navigate('ArrowRight', current);

      expect(result).toEqual(current);
    });

    it('should skip hidden datasets and move to the next visible series', () => {
      const chart = createMockChart({
        datasets: [
          { data: [1, 2], label: 'Series A' },
          { data: [3, 4], label: 'Series B', hidden: true },
          { data: [5, 6], label: 'Series C' },
        ],
      });
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowDown', current);

      expect(result).toEqual({ datasetIndex: 2, index: 0 });
    });

    it('should stay on the current dataset when all other datasets are hidden', () => {
      const chart = createMockChart({
        datasets: [
          { data: [1, 2], label: 'Series A' },
          { data: [3, 4], label: 'Series B', hidden: true },
        ],
      });
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowDown', current);

      expect(result).toEqual({ datasetIndex: 0, index: 0 });
    });
  });

  describe('navigate (horizontal chart, indexAxis=y)', () => {
    it('should move to the next series on ArrowRight', () => {
      const chart = createMockChart({ indexAxis: 'y' });
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowRight', current);

      expect(result).toEqual({ datasetIndex: 1, index: 0 });
    });

    it('should move to the previous series on ArrowLeft', () => {
      const chart = createMockChart({ indexAxis: 'y' });
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 1, index: 0 };

      const result = strategy.navigate('ArrowLeft', current);

      expect(result).toEqual({ datasetIndex: 0, index: 0 });
    });

    it('should move to the next data point on ArrowDown', () => {
      const chart = createMockChart({ indexAxis: 'y' });
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.navigate('ArrowDown', current);

      expect(result).toEqual({ datasetIndex: 0, index: 1 });
    });

    it('should move to the previous data point on ArrowUp', () => {
      const chart = createMockChart({ indexAxis: 'y' });
      const strategy = new CartesianNavigationStrategy(chart);
      const current: FocusedElement = { datasetIndex: 0, index: 2 };

      const result = strategy.navigate('ArrowUp', current);

      expect(result).toEqual({ datasetIndex: 0, index: 1 });
    });
  });

  describe('getTooltipElements', () => {
    it('should return all visible elements at the focused index', () => {
      const chart = createMockChart();
      const strategy = new CartesianNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 1 };

      const result = strategy.getTooltipElements(chart, focused);

      // Both datasets are visible, so both should be in the tooltip.
      expect(result.length).toBe(2);
      expect(result[0].datasetIndex).toBe(0);
      expect(result[0].index).toBe(1);
      expect(result[1].datasetIndex).toBe(1);
      expect(result[1].index).toBe(1);
    });

    it('should exclude hidden datasets from the tooltip', () => {
      const chart = createMockChart({
        datasets: [
          { data: [1, 2], label: 'Series A' },
          { data: [3, 4], label: 'Series B', hidden: true },
        ],
      });
      const strategy = new CartesianNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.getTooltipElements(chart, focused);

      expect(result.length).toBe(1);
      expect(result[0].datasetIndex).toBe(0);
    });

    it('should return empty array when data element does not exist', () => {
      const chart = createMockChart({
        datasets: [{ data: [], label: 'Empty' }],
      });
      const strategy = new CartesianNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 5 };

      const result = strategy.getTooltipElements(chart, focused);

      expect(result.length).toBe(0);
    });
  });

  describe('describeElement', () => {
    it('should describe the focused element with correct values', () => {
      const chart = createMockChart({
        datasets: [{ data: [10, 20, 30], label: 'Revenue' }],
        labels: ['Jan', 'Feb', 'Mar'],
      });
      const strategy = new CartesianNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 1 };

      const result = strategy.describeElement(chart, focused);

      expect(result.seriesLabel).toBe('Revenue');
      expect(result.seriesIndex).toBe(1);
      expect(result.totalSeries).toBe(1);
      expect(result.categoryLabel).toBe('Feb');
      expect(result.value).toBe('20');
      expect(result.index).toBe(2);
      expect(result.total).toBe(3);
    });

    it('should handle missing labels gracefully', () => {
      const chart = createMockChart({
        datasets: [{ data: [5], label: 'S1' }],
        labels: [],
      });
      const strategy = new CartesianNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.describeElement(chart, focused);

      expect(result.categoryLabel).toBe('');
    });

    it('should return empty string value and zero total when datasetIndex is out of bounds', () => {
      const chart = createMockChart({
        datasets: [{ data: [10, 20], label: 'S1' }],
        labels: ['A', 'B'],
      });
      const strategy = new CartesianNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 99, index: 0 };

      const result = strategy.describeElement(chart, focused);

      expect(result.value).toBe('');
      expect(result.total).toBe(0);
    });

    it('should return empty string for series label when dataset has no label', () => {
      const chart = {
        config: { options: { indexAxis: 'x' } },
        data: {
          datasets: [{ data: [1] }],
          labels: ['A'],
        },
        isDatasetVisible: () => true,
        getDatasetMeta: () => ({ data: [createMockDataElement()] }),
      } as unknown as Chart;
      const strategy = new CartesianNavigationStrategy(chart);
      const focused: FocusedElement = { datasetIndex: 0, index: 0 };

      const result = strategy.describeElement(chart, focused);

      expect(result.seriesLabel).toBe('');
    });
  });
});

// #region Test Helpers
function createMockDataElement(): ActiveElement['element'] {
  return {} as ActiveElement['element'];
}

function createMockChart(
  options: {
    datasets?: { data: unknown[]; label?: string; hidden?: boolean }[];
    labels?: string[];
    indexAxis?: 'x' | 'y';
  } = {},
): Chart {
  const datasets = options.datasets ?? [
    { data: [1, 2, 3], label: 'Series A' },
    { data: [4, 5, 6], label: 'Series B' },
  ];
  const labels = options.labels ?? ['Cat 1', 'Cat 2', 'Cat 3'];
  const indexAxis = options.indexAxis ?? 'x';

  const isDatasetVisible = jasmine
    .createSpy('isDatasetVisible')
    .and.callFake((i: number) => !datasets[i]?.hidden);

  const getDatasetMeta = jasmine
    .createSpy('getDatasetMeta')
    .and.callFake((i: number) => ({
      data: datasets[i]?.data.map(() => createMockDataElement()) ?? [],
      hidden: datasets[i]?.hidden ?? false,
    }));

  return {
    config: { options: { indexAxis } },
    data: { datasets, labels },
    isDatasetVisible,
    getDatasetMeta,
  } as unknown as Chart;
}
// #endregion

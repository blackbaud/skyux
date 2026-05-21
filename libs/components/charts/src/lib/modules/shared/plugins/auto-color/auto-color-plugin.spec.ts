import { Chart, ChartDataset } from 'chart.js';

import { SkyChartStyleService } from '../../services/chart-style.service';

import { createAutoColorPlugin } from './auto-color-plugin';

describe('createAutoColorPlugin', () => {
  describe('plugin identity', () => {
    it('should have the correct plugin id', () => {
      const styleService = createMockStyleService(['red', 'blue']);
      const plugin = createAutoColorPlugin(styleService);
      expect(plugin.id).toBe('sky_auto_color');
    });
  });

  describe('dataset mode (non-donut charts)', () => {
    it('should assign a unique color from the palette to each dataset', () => {
      const colors = ['#color1', '#color2', '#color3'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const datasets: ChartDataset[] = [
        { data: [1, 2, 3] },
        { data: [4, 5, 6] },
        { data: [7, 8, 9] },
      ];
      const chart = createMockChart('bar', datasets);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(datasets[0].backgroundColor).toBe('#color1');
      expect(datasets[1].backgroundColor).toBe('#color2');
      expect(datasets[2].backgroundColor).toBe('#color3');
    });

    it('should wrap colors when there are more datasets than palette colors', () => {
      const colors = ['#color1', '#color2'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const datasets: ChartDataset[] = [
        { data: [1] },
        { data: [2] },
        { data: [3] },
      ];
      const chart = createMockChart('bar', datasets);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(datasets[0].backgroundColor).toBe('#color1');
      expect(datasets[1].backgroundColor).toBe('#color2');
      expect(datasets[2].backgroundColor).toBe('#color1');
    });

    it('should set hoverBackgroundColor to the same color as backgroundColor', () => {
      const colors = ['#color1', '#color2'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const datasets: ChartDataset[] = [{ data: [1] }, { data: [2] }];
      const chart = createMockChart('bar', datasets);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(datasets[0].hoverBackgroundColor).toBe('#color1');
      expect(datasets[1].hoverBackgroundColor).toBe('#color2');
    });

    it('should not set borderColor or pointBackgroundColor for bar charts', () => {
      const colors = ['#color1'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const dataset: ChartDataset = { data: [1, 2, 3] };
      const chart = createMockChart('bar', [dataset]);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(dataset.borderColor).toBeUndefined();
      expect(
        (dataset as ChartDataset<'line'>).pointBackgroundColor,
      ).toBeUndefined();
    });

    it('should set borderColor and pointBackgroundColor for line chart datasets', () => {
      const colors = ['#color1', '#color2'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const datasets: ChartDataset<'line'>[] = [
        { type: 'line', data: [1, 2] },
        { type: 'line', data: [3, 4] },
      ];
      const chart = createMockChart('line', datasets);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(datasets[0].borderColor).toBe('#color1');
      expect(datasets[0].pointBackgroundColor).toBe('#color1');
      expect(datasets[1].borderColor).toBe('#color2');
      expect(datasets[1].pointBackgroundColor).toBe('#color2');
    });

    it('should set line-specific colors when the root chart type is line', () => {
      const colors = ['#color1'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      // Dataset without explicit type — inherits chart type (line)
      const dataset: ChartDataset = { data: [1, 2, 3] };
      const chart = createMockChart('line', [dataset]);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(dataset.borderColor).toBe('#color1');
      expect((dataset as ChartDataset<'line'>).pointBackgroundColor).toBe(
        '#color1',
      );
    });

    it('should handle an empty datasets array without errors', () => {
      const styleService = createMockStyleService(['#color1']);
      const plugin = createAutoColorPlugin(styleService);

      const chart = createMockChart('bar', []);

      expect(() =>
        plugin.beforeUpdate?.(chart, beforeUpdateArgs, {}),
      ).not.toThrow();
    });
  });

  describe('data mode (donut charts)', () => {
    it('should assign a unique color to each data point', () => {
      const colors = ['#color1', '#color2', '#color3'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const dataset: ChartDataset = { data: [10, 20, 30] };
      const chart = createMockChart('doughnut', [dataset]);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(dataset.backgroundColor).toEqual([
        '#color1',
        '#color2',
        '#color3',
      ]);
    });

    it('should wrap colors when data points exceed palette length', () => {
      const colors = ['#color1', '#color2'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const dataset: ChartDataset = { data: [10, 20, 30, 40] };
      const chart = createMockChart('doughnut', [dataset]);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(dataset.backgroundColor).toEqual([
        '#color1',
        '#color2',
        '#color1',
        '#color2',
      ]);
    });

    it('should set hoverBackgroundColor to the same array as backgroundColor', () => {
      const colors = ['#color1', '#color2'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const dataset: ChartDataset = { data: [10, 20] };
      const chart = createMockChart('doughnut', [dataset]);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(dataset.hoverBackgroundColor).toEqual(dataset.backgroundColor);
    });

    it('should apply data mode colors to multiple datasets', () => {
      const colors = ['#color1', '#color2'];
      const styleService = createMockStyleService(colors);
      const plugin = createAutoColorPlugin(styleService);

      const datasets: ChartDataset[] = [{ data: [10, 20] }, { data: [30, 40] }];
      const chart = createMockChart('doughnut', datasets);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(datasets[0].backgroundColor).toEqual(['#color1', '#color2']);
      expect(datasets[1].backgroundColor).toEqual(['#color1', '#color2']);
    });

    it('should handle a dataset with no data points', () => {
      const styleService = createMockStyleService(['#color1']);
      const plugin = createAutoColorPlugin(styleService);

      const dataset: ChartDataset = { data: [] };
      const chart = createMockChart('doughnut', [dataset]);

      expect(() =>
        plugin.beforeUpdate?.(chart, beforeUpdateArgs, {}),
      ).not.toThrow();
      expect(dataset.backgroundColor).toEqual([]);
    });
  });

  describe('color freshness', () => {
    it('should read styles from the service on every beforeUpdate call', () => {
      let callCount = 0;
      const serviceWithSpy = {
        styles: jasmine.createSpy('styles').and.callFake(() => {
          callCount++;
          return { palettes: { categorical: [`#call${callCount}`] } };
        }),
      } as unknown as SkyChartStyleService;

      const plugin = createAutoColorPlugin(serviceWithSpy);
      const chart = createMockChart('bar', [{ data: [1] }]);

      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});
      plugin.beforeUpdate?.(chart, beforeUpdateArgs, {});

      expect(serviceWithSpy.styles).toHaveBeenCalledTimes(2);
    });
  });
});

// #region Test Helpers
const beforeUpdateArgs = { mode: 'active', cancelable: true } as const;

function createMockChart(type: string, datasets: ChartDataset[]): Chart {
  return {
    config: { type },
    data: { datasets },
  } as Chart;
}

function createMockStyleService(colors: string[]): SkyChartStyleService {
  return {
    styles: () => ({ palettes: { categorical: colors } }),
  } as unknown as SkyChartStyleService;
}
// #endregion

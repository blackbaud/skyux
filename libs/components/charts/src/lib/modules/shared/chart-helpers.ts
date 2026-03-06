import { Chart, ChartConfiguration } from 'chart.js';

import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';

import { SkyCategory } from './types/category';
import { SkyChartDataPoint } from './types/chart-data-point';
import { SkyChartSeries } from './types/chart-series';

/**
 * Gets the chart type of the given chart
 * @param chart
 * @returns the ChartJS Chart Type
 */
export function getChartType(chart: Chart): string {
  if (isChartConfiguration(chart.config)) {
    return chart.config.type;
  }

  // SkyUX doesn't support Combo Charts
  throw new Error('Unsupported chart type');
}

/**
 * Checks if the given chart is a Pie or Donut chart
 */
export function isDonutOrPieChart(chart: Chart): boolean {
  const chartType = getChartType(chart);
  return chartType === 'pie' || chartType === 'doughnut';
}

/**
 * Checks if the given configuration is a ChartConfiguration
 * @param config
 * @returns Type Guard asserting that the configuration is `ChartConfiguration`
 */
export function isChartConfiguration(
  config: Chart['config'],
): config is ChartConfiguration {
  return 'type' in config && typeof config.type === 'string';
}

/**
 * Parses categories from the given series data.
 * @param series
 */
export function parseCategories(
  series: readonly SkyChartSeries<SkyChartDataPoint>[],
): SkyCategory[] {
  const allCategories = series.flatMap((series) =>
    series.data.map((dp) => dp.category),
  );

  const uniqueCategories = Array.from(new Set(allCategories));

  return uniqueCategories;
}

/**
 * Gets legend items for the given chart
 *
 * @param context.chart The ChartJS chart instance
 * @param context.legendMode The legend mode determines whether the legend items correspond to series or categories in the chart.
 * @param context.labels The labels corresponding to the categories or series in the chart
 * @returns An array of legend items
 */
export function getLegendItems(context: {
  chart: Chart | undefined;
  legendMode: 'series' | 'category';
  labels: readonly string[];
}): SkyChartLegendItem[] {
  const { chart, legendMode, labels } = context;

  if (!chart) {
    return [];
  }

  const chartJsLabels = chart.options.plugins?.legend?.labels;
  const chartJsLegendItems = chartJsLabels?.generateLabels?.(chart) ?? [];

  return chartJsLegendItems.map((legendItem) => {
    const datasetIndex = legendItem.datasetIndex ?? 0;
    const dataIndex = legendItem.index ?? 0;

    const index = legendMode === 'series' ? datasetIndex : dataIndex;
    const label = labels[index];

    const isVisible =
      legendMode === 'series'
        ? chart.isDatasetVisible(datasetIndex)
        : chart.getDataVisibility(dataIndex);

    const item: SkyChartLegendItem = {
      datasetIndex: legendItem.datasetIndex ?? 0,
      index: legendItem.index ?? 0,
      isVisible: isVisible,
      labelText: label,
      seriesColor: String(legendItem.fillStyle ?? 'transparent'),
    };

    return item;
  });
}

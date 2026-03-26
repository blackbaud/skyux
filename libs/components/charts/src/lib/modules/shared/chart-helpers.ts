import { Chart, ChartConfiguration, ChartDataset, ChartType } from 'chart.js';

import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';

import { SkyCategory } from './types/category';
import { SkyChartDataPoint } from './types/chart-data-point';
import { SkyChartSeries } from './types/chart-series';

/**
 * Determines the dataset type for the given dataset.
 * @remarks This takes into account both the dataset's explicit type and the chart's root type.
 * @param chart The ChartJS chart instance that the dataset belongs to
 * @param dataset The dataset to determine the type of
 * @returns The ChartJS Chart Type of the dataset
 */
function getDatasetType(chart: Chart, dataset: ChartDataset): ChartType {
  const datasetType = dataset.type;

  // If the dataset has an explicit type, use it
  if (datasetType !== undefined) {
    return datasetType;
  }

  // Otherwise, use the root chart type
  const chartType = getChartType(chart);

  return chartType;
}

/**
 * Type guard to check if the given dataset is of the specified type.
 * @remarks This takes into account both the dataset's explicit type and the chart's root type.
 * @param chart The ChartJS chart instance that the dataset belongs to
 * @param dataset The dataset to check the type of
 * @param type The chart type to check against
 * @returns Type Guard asserting that the dataset is of the specified type
 */
export function isDatasetType<T extends ChartType>(
  chart: Chart,
  dataset: ChartDataset,
  type: T,
): dataset is ChartDataset & { type: T } {
  return getDatasetType(chart, dataset) === type;
}

/**
 * Gets the chart type of the given chart
 * @param chart
 * @returns the ChartJS Chart Type
 */
export function getChartType(chart: Chart): ChartType {
  if (isChartConfiguration(chart.config)) {
    return chart.config.type;
  }

  throw new Error('Unknown chart type');
}

/**
 * Checks if the given chart is a Pie or Donut chart
 */
export function isDonutChart(chart: Chart): chart is Chart<'doughnut'> {
  const chartType = getChartType(chart);
  return chartType === 'doughnut';
}

/**
 * Checks if the given configuration is a ChartConfiguration
 * @param config
 * @returns Type Guard asserting that the configuration is `ChartConfiguration`
 */
function isChartConfiguration(
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

/**
 * Creates a tick filter function for logarithmic axes that only shows ticks at powers of 10.
 * @param value The tick value
 * @param formatter An optional formatter function to format the tick label
 * @returns The formatted tick label if it's a power of 10, otherwise an empty string for no tick
 */
export function createLogTickFilter(value: string | number): string {
  const noTick = '';
  const numeric = Number(value);

  // Show only powers of 10
  const isPowerOf10 = numeric > 0 && Math.log10(numeric) % 1 === 0;

  if (!isPowerOf10) {
    return noTick;
  }

  return numeric.toLocaleString();
}

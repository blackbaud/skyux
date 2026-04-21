import { SkyLibResourcesService } from '@skyux/i18n';

import { Chart, ChartConfiguration, ChartDataset, ChartType } from 'chart.js';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';

import { SkyChartAxisConfig } from './types/axis-types';
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
export function getDatasetType(chart: Chart, dataset: ChartDataset): ChartType {
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
  const allCategories = series.flatMap((s) => s.data.map((dp) => dp.category));
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
 * Returns the label string from an axis config's `labelText`, or `undefined` when no label is set.
 */
function getAxisLabelText(
  config: Readonly<SkyChartAxisConfig> | undefined,
): string | undefined {
  const labelText = config?.labelText;
  if (!labelText) {
    return undefined;
  }
  return Array.isArray(labelText) ? labelText.join(',') : labelText;
}

/**
 * Builds a chart summary by combining heading, chart type description, subtitle, and optional axes.
 * @param context.headingText Optional heading text for the chart
 * @param context.subtitleText Optional subtitle text for the chart
 * @param context.chartTypeDescription$ Observable of the chart type description
 * @param context.categoryAxis Optional category axis configuration
 * @param context.measureAxis Optional measure axis configuration
 * @param context.resources The resources service for i18n strings
 * @returns Observable of the assembled chart summary
 * @internal
 */
export function buildChartSummary(context: {
  resources: SkyLibResourcesService;
  headingText: string | undefined;
  subtitleText: string | undefined;
  chartTypeDescription$: Observable<string>;
  categoryAxis?: Readonly<SkyChartAxisConfig>;
  measureAxis?: Readonly<SkyChartAxisConfig>;
}): Observable<string> {
  const {
    headingText,
    subtitleText,
    chartTypeDescription$,
    categoryAxis,
    measureAxis,
    resources,
  } = context;

  const observables: Observable<string>[] = [];

  if (headingText) {
    observables.push(of(headingText));
  }

  observables.push(chartTypeDescription$);

  if (subtitleText) {
    observables.push(of(subtitleText));
  }

  const categoryAxisLabel = getAxisLabelText(categoryAxis);
  if (categoryAxisLabel) {
    observables.push(
      resources.getString('chart.summary.category_axis', categoryAxisLabel),
    );
  }

  const measureAxisLabel = getAxisLabelText(measureAxis);
  if (measureAxisLabel) {
    observables.push(
      resources.getString('chart.summary.measure_axis', measureAxisLabel),
    );
  }

  // Combine all sentence parts into a single string
  return combineLatest(observables).pipe(map((values) => values.join(' ')));
}

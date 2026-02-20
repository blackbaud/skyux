import { Chart, ChartConfiguration } from 'chart.js';

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

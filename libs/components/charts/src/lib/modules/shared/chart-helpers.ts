import { Chart, ChartConfiguration } from 'chart.js';

import { SkyCategory, SkyChartDataPoint, SkyChartSeries } from './chart-types';

/**
 * Gets the chart type of the given chart
 * @param chart
 * @returns the ChartJS Chart Type
 */
export function getChartType(chart: Chart): string {
  if (isChartConfiguration(chart.config)) {
    return chart.config.type;
  }

  // SkyUX doesn't support Combo Charts (ChartConfigurationCustomTypesPerDataset)
  throw new Error('Unsupported chart type');
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

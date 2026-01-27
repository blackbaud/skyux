import { Chart, ChartConfiguration } from 'chart.js';

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

import { ChartConfiguration, ChartOptions } from 'chart.js';

import { SkyBarChartConfig, SkyChartAxisConfig } from '../shared/chart-types';
import { createAutoColorPlugin } from '../shared/plugins/auto-color-plugin';
import { createChartA11yPlugin } from '../shared/plugins/chart-a11y-plugin';
import { createLegendA11yPlugin } from '../shared/plugins/legend-a11y-plugin';
import { createLegendBackgroundPlugin } from '../shared/plugins/legend-background-plugin';
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';

import { getSkyuxBarChartConfig } from './bar-chart-config';

/**
 * Transforms a consumer-friendly SkyBarChartConfig into a ChartJS ChartConfiguration.
 * This function encapsulates all ChartJS implementation details and provides
 * a clean mapping from the public API to the internal representation.
 */
export function transformToChartJsConfig(
  config: SkyBarChartConfig,
): ChartConfiguration<'bar'> {
  const orientation = config.orientation || 'vertical';
  const isHorizontal = orientation === 'horizontal';

  // Determine which axis is which based on orientation
  const categoryAxisKey = isHorizontal ? 'y' : 'x';
  const valueAxisKey = isHorizontal ? 'x' : 'y';

  // Build scales configuration
  const scales = buildScalesConfig(
    categoryAxisKey,
    valueAxisKey,
    config.categoryAxis,
    config.valueAxis,
  );

  // Build ChartJS options
  // prettier-ignore
  const chartOptions = getSkyuxBarChartConfig({
    indexAxis: isHorizontal ? 'y' : 'x',
    scales,
    plugins: {
      title: config.title ? { display: true, text: config.title } : undefined,
      subtitle: config.subtitle ? { display: true, text: config.subtitle } : undefined,
      tooltip: {
        // callbacks: buildTooltipCallbacks(config, isHorizontal),
      },
    },
    onClick: (e, elements, chart) => {
      if (elements.length === 0) {
        return;
      }

      const seriesIndex = elements[0]?.datasetIndex;
      const dataIndex = elements[0]?.index;

      const dataset = chart.data.datasets[seriesIndex];
      const dataValue = dataset.data[dataIndex];

      const category = dataset.label;
      const value = dataValue;

      console.log('Clicked', { seriesIndex, dataIndex, category, value });
    },
  });

  // Build datasets from series
  const datasets = config.series.map((series) => ({
    label: series.label,
    data: series.data.map((dp) => dp.value),
  }));

  return {
    type: 'bar',
    data: {
      labels: config.categories,
      datasets: datasets,
    },
    options: chartOptions,
    plugins: [
      createChartA11yPlugin(),
      createLegendA11yPlugin(),
      createAutoColorPlugin(),
      createTooltipShadowPlugin(),
      createLegendBackgroundPlugin(),
    ],
  };
}

/**
 * Builds the scales configuration for ChartJS based on axis settings.
 */
function buildScalesConfig(
  categoryAxisKey: 'x' | 'y',
  valueAxisKey: 'x' | 'y',
  categoryAxisConfig?: SkyChartAxisConfig,
  valueAxisConfig?: SkyChartAxisConfig,
): Partial<ChartOptions<'bar'>['scales']> {
  const scales: Partial<ChartOptions<'bar'>['scales']> = {};

  // Configure category axis
  scales[categoryAxisKey] = {};

  // Configure value axis
  scales[valueAxisKey] = {
    beginAtZero: valueAxisConfig?.beginAtZero ?? true,
  };

  return scales;
}

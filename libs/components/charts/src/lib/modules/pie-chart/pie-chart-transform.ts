import { ChartConfiguration, ChartDataset } from 'chart.js';

import { SkyPieChartConfig } from '../shared/chart-types';
import { createAutoColorPlugin } from '../shared/plugins/auto-color-plugin';
import { createChartA11yPlugin } from '../shared/plugins/chart-a11y-plugin';
import { createLegendA11yPlugin } from '../shared/plugins/legend-a11y-plugin';
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';

import {
  getSkyuxDoughnutChartConfig,
  getSkyuxDoughnutDatasetBorder,
} from './pie-chart-config';

/**
 * Transforms a consumer-friendly SkyPieChartConfig into a ChartJS ChartConfiguration.
 * This function encapsulates all ChartJS implementation details and provides
 * a clean mapping from the public API to the internal representation.
 */
export function transformToChartJsConfig(
  config: SkyPieChartConfig,
): ChartConfiguration<'pie' | 'doughnut'> {
  // Build ChartJS options
  // prettier-ignore
  const chartOptions = getSkyuxDoughnutChartConfig({
    plugins: {
      title: config.title ? { display: true, text: config.title } : undefined,
      subtitle: config.subtitle ? { display: true, text: config.subtitle } : undefined,
      tooltip: {
        // callbacks: buildTooltipCallbacks(config),
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

  // Get border configuration
  const { borderWidth, borderColor } = getSkyuxDoughnutDatasetBorder();

  // Build datasets from series
  const dataset: ChartDataset<'pie' | 'doughnut'> = {
    label: config.series.label,
    data: config.series.data.map((dp) => dp.value),
    borderWidth,
    borderColor,
  };

  const chartJsConfig: ChartConfiguration<'pie' | 'doughnut'> = {
    type: 'pie',
    data: {
      labels: config.categories,
      datasets: [dataset],
    },
    options: chartOptions,
    plugins: [
      createChartA11yPlugin(),
      createLegendA11yPlugin(),
      createAutoColorPlugin(),
      createTooltipShadowPlugin(),
    ],
  };

  console.log('ChartJsConfig', chartJsConfig);

  return chartJsConfig;
}

import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';

import { SkyDonutChartConfig } from '../shared/chart-types';
import { SkyuxChartStyles } from '../shared/global-chart-config';
import { getLegendPluginOptions } from '../shared/plugin-config/legend-plugin';
import { getTooltipPluginOptions } from '../shared/plugin-config/tooltip-plugin';
import { createAutoColorPlugin } from '../shared/plugins/auto-color-plugin';
import { createChartA11yPlugin } from '../shared/plugins/chart-a11y-plugin';
import { createLegendA11yPlugin } from '../shared/plugins/legend-a11y-plugin';
import { createLegendBackgroundPlugin } from '../shared/plugins/legend-background-plugin';
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';

/**
 * Transforms a consumer-friendly SkyDonutChartConfig into a ChartJS ChartConfiguration.
 */
export function getChartJsDonutChartConfig(
  skyConfig: SkyDonutChartConfig,
): ChartConfiguration<'doughnut'> {
  const { borderWidth, borderColor } = getSkyuxDonutDatasetBorder();

  // Build datasets from series
  const dataset: ChartDataset<'doughnut'> = {
    label: skyConfig.series.label,
    data: skyConfig.series.data.map((dp) => dp.value),
    borderWidth,
    borderColor,
  };

  // Build Plugin options
  const pluginOptions: ChartOptions['plugins'] = {
    // TODO: Previously set boxWidth: 12, boxHeight: 12,
    legend: getLegendPluginOptions({ position: 'right' }),
    // TODO: used the default for mode/intersect
    tooltip: getTooltipPluginOptions(),
  };

  if (skyConfig.title) {
    pluginOptions.title = { display: true, text: skyConfig.title };
  }

  if (skyConfig.subtitle) {
    pluginOptions.subtitle = { display: true, text: skyConfig.subtitle };
  }

  // Build chart options
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    datasets: {
      doughnut: {
        borderWidth: 2,
        borderColor: SkyuxChartStyles.barBorderColor,
      },
    },
    plugins: pluginOptions,
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
  };

  return {
    type: 'doughnut',
    data: {
      labels: skyConfig.categories,
      datasets: [dataset],
    },
    options: options,
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
 * Get dataset border configuration for doughnut charts
 * Returns border width and color to apply to dataset
 */
function getSkyuxDonutDatasetBorder(): {
  borderWidth: number;
  borderColor: string;
} {
  const borderColor = SkyuxChartStyles.barBorderColor;

  return {
    borderWidth: 2,
    borderColor: borderColor,
  };
}

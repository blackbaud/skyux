import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';

import { SkyuxChartStyles } from '../shared/chart-styles';
import {
  SkyChartDataPointClickEvent,
  SkyDonutChartConfig,
} from '../shared/chart-types';
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
  callbacks: {
    onDataPointClick: (event: SkyChartDataPointClickEvent) => void;
  },
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
    legend: getLegendPluginOptions({ position: 'right' }),
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
    // Responsiveness
    responsive: true,
    maintainAspectRatio: false,

    // Layout padding
    layout: {
      padding: SkyuxChartStyles.chartPadding,
    },

    // Interaction options
    interaction: {
      mode: 'nearest',
      intersect: false,
    },

    // Animation options
    animation: {
      duration: 400,
      easing: 'easeInOutQuart',
    },

    datasets: {
      doughnut: {
        borderWidth: 2,
        borderColor: SkyuxChartStyles.barBorderColor,
      },
    },
    plugins: pluginOptions,
    onClick: (e, elements) => {
      if (elements.length === 0) {
        return;
      }

      const element = elements[0];
      const seriesIndex = element.datasetIndex;
      const dataIndex = element.index;

      callbacks.onDataPointClick({ seriesIndex, dataIndex });
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

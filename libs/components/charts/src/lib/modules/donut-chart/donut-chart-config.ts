import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  TooltipItem,
} from 'chart.js';

import { SkyuxChartStyles } from '../shared/chart-styles';
import { mergeChartConfig } from '../shared/global-chart-config';
import { createAutoColorPlugin } from '../shared/plugins/auto-color-plugin';
import { createChartA11yPlugin } from '../shared/plugins/chart-a11y-plugin';
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';
import { SkySelectedChartDataPoint } from '../shared/types/selected-chart-data-point';

import { SkyDonutChartConfig } from './donut-chart-types';

/**
 * Transforms a consumer-friendly SkyDonutChartConfig into a ChartJS ChartConfiguration.
 */
export function getChartJsDonutChartConfig(
  skyConfig: SkyDonutChartConfig,
  callbacks: {
    onDataPointClick: (event: SkySelectedChartDataPoint) => void;
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
    tooltip: {
      callbacks: {
        label(context) {
          const { dataIndex } = context;
          const dataset = skyConfig.series;
          const dataPoint = dataset.data[dataIndex];

          const percent = percentOfVisibleDataset(context);
          return `${dataPoint.label} (${percent.toFixed(2)}%)`;
        },
      },
    },
  };

  // Build chart options
  const options = mergeChartConfig<'doughnut'>({
    interaction: {
      mode: 'nearest',
      intersect: true,
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
  });

  return {
    type: 'doughnut',
    data: {
      labels: skyConfig.series.data.map((d) => d.category),
      datasets: [dataset],
    },
    options: options,
    plugins: [
      createAutoColorPlugin(),
      createTooltipShadowPlugin(),
      createChartA11yPlugin(),
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

function percentOfVisibleDataset(context: TooltipItem<'doughnut'>): number {
  const value = Number(context.raw) || 0;
  const chart = context.chart;

  // Total up the visible data points in the dataset
  const visibleTotal = context.dataset.data.reduce((sum, v, i) => {
    if (!chart.getDataVisibility(i)) {
      return sum;
    }

    return sum + (Number(v) || 0);
  }, 0);

  return visibleTotal ? (value / visibleTotal) * 100 : 0;
}

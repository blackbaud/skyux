import {
  ChartConfiguration,
  ChartOptions,
  ChartTypeRegistry,
  ScaleOptionsByType,
} from 'chart.js';

import { DeepPartial, SkyBarChartConfig } from '../shared/chart-types';
import { SkyuxChartStyles } from '../shared/global-chart-config';
import { getLegendPluginOptions } from '../shared/plugin-config/legend-plugin';
import { getTooltipPluginOptions } from '../shared/plugin-config/tooltip-plugin';
import { createAutoColorPlugin } from '../shared/plugins/auto-color-plugin';
import { createChartA11yPlugin } from '../shared/plugins/chart-a11y-plugin';
import { createLegendA11yPlugin } from '../shared/plugins/legend-a11y-plugin';
import { createLegendBackgroundPlugin } from '../shared/plugins/legend-background-plugin';
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';

/**
 * Transforms a consumer-friendly SkyBarChartConfig into a ChartJS ChartConfiguration.
 */
export function getChartJsBarChartConfig(
  skyConfig: SkyBarChartConfig,
): ChartConfiguration<'bar'> {
  const orientation = skyConfig.orientation || 'vertical';
  const isHorizontal = orientation === 'horizontal';

  // Build datasets from series
  const datasets = skyConfig.series.map((series) => ({
    label: series.label,
    data: series.data.map((dp) => dp.value),
  }));

  // Build Plugin options
  const pluginOptions: ChartOptions['plugins'] = {
    legend: getLegendPluginOptions(),
    tooltip: getTooltipPluginOptions(),
  };

  if (skyConfig.title) {
    pluginOptions.title = { display: true, text: skyConfig.title };
  }

  if (skyConfig.subtitle) {
    pluginOptions.subtitle = { display: true, text: skyConfig.subtitle };
  }

  // Build chart options
  const options: ChartOptions<'bar'> = {
    indexAxis: isHorizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    datasets: {
      bar: {
        categoryPercentage: 0.7,
        // barPercentage: 0.7,
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderColor: SkyuxChartStyles.barBorderColor,
        borderRadius: SkyuxChartStyles.barBorderRadius,
      },
    },
    scales: createLinearScales(skyConfig),
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
    type: 'bar',
    data: {
      labels: skyConfig.categories,
      datasets: datasets,
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

type PartialLinearScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['bar']['scales']>
>;

function createLinearScales(
  skyConfig: SkyBarChartConfig,
): ChartOptions<'bar'>['scales'] {
  const orientation = skyConfig.orientation ?? 'vertical';
  const isHorizontal = orientation === 'horizontal';
  const valueAxis = isHorizontal ? 'x' : 'y';

  const base: PartialLinearScale = {
    grid: {
      display: true,
      color: SkyuxChartStyles.axisGridLineColor,
      drawTicks: false,
    },
    border: {
      display: true,
      color: SkyuxChartStyles.axisLineColor,
    },
    ticks: {
      color: SkyuxChartStyles.axisTickColor,
      font: {
        size: SkyuxChartStyles.axisTickFontSize,
        family: SkyuxChartStyles.fontFamily,
        weight: SkyuxChartStyles.axisTickFontWeight,
      },
      padding: SkyuxChartStyles.axisTickPadding,
    },
  };

  const x: PartialLinearScale = {
    type: valueAxis === 'x' ? 'linear' : 'category',
    beginAtZero: skyConfig.valueAxis?.beginAtZero ?? true,
    // spread syntax does not work
    grid: base.grid,
    border: base.border,
    ticks: base.ticks,
  };

  const y: PartialLinearScale = {
    type: valueAxis === 'y' ? 'linear' : 'category',
    beginAtZero: skyConfig.valueAxis?.beginAtZero ?? true,
    // spread syntax does not work
    grid: base.grid,
    border: base.border,
    ticks: base.ticks,
  };

  return { x, y };
}

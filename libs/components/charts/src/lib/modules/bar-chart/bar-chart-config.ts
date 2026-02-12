import {
  ChartConfiguration,
  ChartOptions,
  ChartTypeRegistry,
  ScaleOptionsByType,
} from 'chart.js';

import { SkyuxChartStyles } from '../shared/chart-styles';
import {
  DeepPartial,
  SkyBarChartConfig,
  SkyChartDataPointClickEvent,
} from '../shared/chart-types';
import { mergeChartConfig } from '../shared/global-chart-config';
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
  callbacks: {
    onDataPointClick: (event: SkyChartDataPointClickEvent) => void;
  },
): ChartConfiguration<'bar'> {
  const orientation = skyConfig.orientation || 'vertical';
  const isHorizontal = orientation === 'horizontal';

  // Build datasets from series
  const datasets = skyConfig.series.map((series) => ({
    label: series.label,
    data: series.data.map((dp) => dp.value),
    stack: series.stackId ?? undefined,
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
  const options = mergeChartConfig<'bar'>({
    indexAxis: isHorizontal ? 'y' : 'x',
    datasets: {
      bar: {
        categoryPercentage: 0.7,
        // barPercentage: 0.7,
      },
    },
    elements: {
      bar: {
        borderWidth: SkyuxChartStyles.barBorderWidth,
        borderColor: SkyuxChartStyles.barBorderColor,
        borderRadius: SkyuxChartStyles.barBorderRadius,
      },
    },
    scales: createLinearScales(skyConfig),
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

// eslint-disable-next-line complexity
function createLinearScales(
  skyConfig: SkyBarChartConfig,
): ChartOptions<'bar'>['scales'] {
  const orientation = skyConfig.orientation ?? 'vertical';
  const isHorizontal = orientation === 'horizontal';
  const valueAxis = isHorizontal ? 'x' : 'y';
  const categoryAxis = isHorizontal ? 'y' : 'x';

  const base: PartialLinearScale = {
    grid: {
      display: true,
      color: SkyuxChartStyles.axisGridLineColor,
      tickColor: SkyuxChartStyles.axisGridLineColor,
      drawTicks: true,
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
    },
    title: {
      display: false,
      font: {
        size: SkyuxChartStyles.scaleTitleFontSize,
        family: SkyuxChartStyles.scaleTitleFontFamily,
      },
      color: SkyuxChartStyles.scaleTitleColor,
      padding: {
        top: SkyuxChartStyles.scaleXTitlePaddingTop,
        bottom: SkyuxChartStyles.scaleXTitlePaddingBottom,
      },
    },
  };
  const noGridLines: PartialLinearScale['grid'] = {
    lineWidth: 0,
    drawTicks: false,
    tickLength: 0,
  };

  const x: PartialLinearScale = {
    type: valueAxis === 'x' ? 'linear' : 'category',
    stacked: skyConfig.stacked ?? false,
    beginAtZero:
      valueAxis === 'x'
        ? skyConfig.valueAxis?.beginAtZero
        : skyConfig.categoryAxis?.beginAtZero,
    grid: {
      ...base.grid,
      tickLength: SkyuxChartStyles.axisTickLengthX,
    },
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingX,
      ...(categoryAxis === 'x' ? noGridLines : {}),
    },
    title: {
      ...base.title,
      padding: {
        top: SkyuxChartStyles.scaleXTitlePaddingTop,
        bottom: SkyuxChartStyles.scaleXTitlePaddingBottom,
      },
    },
  };

  const y: PartialLinearScale = {
    type: valueAxis === 'y' ? 'linear' : 'category',
    stacked: skyConfig.stacked ?? false,
    beginAtZero:
      valueAxis === 'y'
        ? skyConfig.valueAxis?.beginAtZero
        : skyConfig.categoryAxis?.beginAtZero,
    grid: {
      ...base.grid,
      tickLength: SkyuxChartStyles.axisTickLengthY,
    },
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
      ...(categoryAxis === 'y' ? noGridLines : {}),
    },
    title: {
      ...base.title,
      padding: {
        top: SkyuxChartStyles.scaleYTitlePaddingLeft,
        bottom: SkyuxChartStyles.scaleYTitlePaddingRight,
      },
    },
  };

  return { x, y };
}

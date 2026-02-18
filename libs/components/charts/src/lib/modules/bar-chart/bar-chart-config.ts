import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartTypeRegistry,
  ScaleOptionsByType,
} from 'chart.js';

import { parseCategories } from '../shared/chart-helpers';
import { SkyuxChartStyles } from '../shared/chart-styles';
import {
  DeepPartial,
  SkyCategory,
  SkyChartDataPointClickEvent,
} from '../shared/chart-types';
import { mergeChartConfig } from '../shared/global-chart-config';
import { createAutoColorPlugin } from '../shared/plugins/auto-color-plugin';
// import { createChartA11yPlugin } from '../shared/plugins/chart-a11y-plugin';
// import { createLegendA11yPlugin } from '../shared/plugins/legend-a11y-plugin';
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';

import { SkyBarChartConfig } from './bar-chart-types';

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
  const isVertical = orientation === 'vertical';

  // Build categories from series data
  const categories = parseCategories(skyConfig.series);

  // Build datasets from series
  const datasets = skyConfig.series.map((series) => {
    const byCategory = new Map<SkyCategory, number | [number, number] | null>();

    for (const p of series.data) {
      byCategory.set(p.category, p.value);
    }

    const data: (number | [number, number] | null)[] = categories.map(
      (category) => {
        return byCategory.get(category) ?? null;
      },
    );

    const dataset: ChartDataset<'bar'> = {
      label: series.label,
      data: data,
    };

    return dataset;
  });

  // Build Plugin options
  const pluginOptions: ChartOptions['plugins'] = {};

  if (skyConfig.title) {
    pluginOptions.title = { display: true, text: skyConfig.title };
  }

  if (skyConfig.subtitle) {
    pluginOptions.subtitle = { display: true, text: skyConfig.subtitle };
  }

  // Build chart options
  const options = mergeChartConfig<'bar'>({
    indexAxis: isVertical ? 'x' : 'y',
    interaction: getInteraction(skyConfig),
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
      labels: categories,
      datasets: datasets,
    },
    options: options,
    plugins: [
      // createChartA11yPlugin(),
      createAutoColorPlugin(),
      createTooltipShadowPlugin(),
    ],
  };
}

function getInteraction(
  skyConfig: SkyBarChartConfig,
): ChartOptions['interaction'] {
  const interaction: ChartOptions['interaction'] = {
    mode: 'nearest',
    intersect: false,
    axis: 'x',
  };

  if (skyConfig.orientation === 'vertical') {
    interaction.axis = 'x';
  }

  if (skyConfig.orientation === 'horizontal') {
    interaction.axis = 'y';
  }

  if (skyConfig.series.length > 1) {
    interaction.axis = 'xy';
  }

  return interaction;
}

type PartialLinearScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['bar']['scales']>
>;

// eslint-disable-next-line complexity
function createLinearScales(
  skyConfig: SkyBarChartConfig,
): ChartOptions<'bar'>['scales'] {
  const orientation = skyConfig.orientation ?? 'vertical';
  const isVertical = orientation === 'vertical';
  const valueAxis = isVertical ? 'y' : 'x';
  const categoryAxis = isVertical ? 'x' : 'y';

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
      major: { enabled: true },
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
    display: false,
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
      ...(categoryAxis === 'x' ? noGridLines : {}),
      tickLength: categoryAxis === 'x' ? SkyuxChartStyles.axisTickLengthXHidden : SkyuxChartStyles.axisTickLengthX,
    },
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingX,
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
      ...(categoryAxis === 'y' ? noGridLines : {}),
      tickLength: categoryAxis === 'y' ? SkyuxChartStyles.axisTickLengthYHidden : SkyuxChartStyles.axisTickLengthY,
    },
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
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

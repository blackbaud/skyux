import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartTypeRegistry,
  ScaleOptionsByType,
} from 'chart.js';

import { parseCategories } from '../shared/chart-helpers';
import { SkyuxChartStyles } from '../shared/chart-styles';
import { mergeChartOptions } from '../shared/global-chart-config';
import { createAutoColorPlugin } from '../shared/plugins/auto-color-plugin';
import { createChartA11yPlugin } from '../shared/plugins/chart-a11y-plugin';
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';
import { SkyCategory } from '../shared/types/category';
import { DeepPartial } from '../shared/types/deep-partial-type';
import { SkySelectedChartDataPoint } from '../shared/types/selected-chart-data-point';

import { SkyBarChartConfig } from './bar-chart-types';

/**
 * Transforms a consumer-friendly SkyBarChartConfig into a ChartJS ChartConfiguration.
 */
export function getChartJsBarChartConfig(
  skyConfig: SkyBarChartConfig,
  callbacks: {
    onDataPointClick: (event: SkySelectedChartDataPoint) => void;
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
  const pluginOptions: ChartOptions['plugins'] = {
    tooltip: {
      callbacks: {
        label: function (context) {
          const { datasetIndex, dataIndex } = context;
          const dataset = skyConfig.series[datasetIndex];
          const dataPoint = dataset.data[dataIndex];

          // TODO: Chart localization
          return `${dataset.label}: ${dataPoint.label}`;
        },
      },
    },
  };

  // Build chart options
  const options = mergeChartOptions<'bar'>({
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
    scales: createScales(skyConfig),
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
      createAutoColorPlugin(),
      createTooltipShadowPlugin(),
      createChartA11yPlugin(),
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

type PartialBarScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['bar']['scales']>
>;

/**
 * Creates the scales configuration for the bar chart.
 * @param skyConfig
 * @returns
 */
function createScales(
  skyConfig: SkyBarChartConfig,
): ChartOptions<'bar'>['scales'] {
  const orientation = skyConfig.orientation ?? 'vertical';
  const isVertical = orientation === 'vertical';
  const categoryAxis = isVertical ? 'y' : 'x';
  const valueAxis = isVertical ? 'x' : 'y';

  const categoryScale = createCategoryScale(skyConfig, categoryAxis);
  const valueScale = createValueScale(skyConfig, valueAxis);

  if (orientation === 'vertical') {
    return { x: categoryScale, y: valueScale };
  } else {
    return { x: valueScale, y: categoryScale };
  }
}

function getBaseScale(): PartialBarScale {
  const base: PartialBarScale = {
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
      display: true,
      font: {
        size: SkyuxChartStyles.scaleTitleFontSize,
        family: SkyuxChartStyles.scaleTitleFontFamily,
      },
      color: SkyuxChartStyles.scaleTitleColor,
    },
  };

  return base;
}

function createCategoryScale(
  config: SkyBarChartConfig,
  axis: 'x' | 'y',
): PartialBarScale {
  const base = getBaseScale();

  const categoryScale: PartialBarScale = {
    type: 'category',
    stacked: config.stacked ?? false,
    grid: {
      display: false,
      lineWidth: 0,
      drawTicks: false,
      tickLength: 0,
    },
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingX,
    },
    title: {
      ...base.title,
      display: !!config.categoryAxis?.label,
      text: config.categoryAxis?.label ?? '',
      padding: getScaleTitlePadding(axis),
    },
  };

  return categoryScale;
}

function createValueScale(
  config: SkyBarChartConfig,
  axis: 'x' | 'y',
): PartialBarScale {
  if (config.valueAxis?.scaleType === 'logarithmic') {
    return createLogarithmicValueScale(config, axis);
  } else {
    return createLinearValueScale(config, axis);
  }
}

function createLinearValueScale(
  config: SkyBarChartConfig,
  axis: 'x' | 'y',
): PartialBarScale {
  const base = getBaseScale();

  const valueScale: PartialBarScale = {
    type: 'linear',
    stacked: config.stacked ?? false,
    beginAtZero: true,
    suggestedMin: config.valueAxis?.suggestedMin,
    suggestedMax: config.valueAxis?.suggestedMax,
    grid: {
      display: true,
      color: SkyuxChartStyles.axisGridLineColor,
      tickColor: SkyuxChartStyles.axisGridLineColor,
      drawTicks: true,
      tickLength: SkyuxChartStyles.axisTickLength,
    },
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
      // TODO: Chart localization
      callback: config.valueAxis?.tickFormatter,
    },
    title: {
      ...base.title,
      display: !!config.valueAxis?.label,
      text: config.valueAxis?.label,
      padding: getScaleTitlePadding(axis),
    },
  };

  return valueScale;
}

function createLogarithmicValueScale(
  config: SkyBarChartConfig,
  axis: 'x' | 'y',
): PartialBarScale {
  const base = getBaseScale();

  const valueScale: PartialBarScale = {
    type: 'logarithmic',
    stacked: config.stacked ?? false,
    suggestedMin: config.valueAxis?.suggestedMin,
    suggestedMax: config.valueAxis?.suggestedMax,
    grid: {
      display: true,
      color: SkyuxChartStyles.axisGridLineColor,
      tickColor: SkyuxChartStyles.axisGridLineColor,
      drawTicks: true,
      tickLength: SkyuxChartStyles.axisTickLength,
    },
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
      // TODO: Chart localization
      callback: config.valueAxis?.tickFormatter,
    },
    title: {
      ...base.title,
      display: !!config.valueAxis?.label,
      text: config.valueAxis?.label,
      padding: getScaleTitlePadding(axis),
    },
  };

  return valueScale;
}

function getScaleTitlePadding(axis: 'x' | 'y'): {
  top: number;
  bottom: number;
} {
  return {
    top:
      axis === 'x'
        ? SkyuxChartStyles.scaleXTitlePaddingTop
        : SkyuxChartStyles.scaleYTitlePaddingLeft,
    bottom:
      axis === 'x'
        ? SkyuxChartStyles.scaleXTitlePaddingBottom
        : SkyuxChartStyles.scaleYTitlePaddingRight,
  };
}

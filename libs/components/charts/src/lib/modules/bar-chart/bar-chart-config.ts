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
import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';
import { SkyCategory } from '../shared/types/category';
import { SkyChartSeries } from '../shared/types/chart-series';
import { DeepPartial } from '../shared/types/deep-partial-type';
import { SkySelectedChartDataPoint } from '../shared/types/selected-chart-data-point';

import { SkyBarChartOrientation, SkyBarChartPoint } from './bar-chart-types';

/** Configuration for the bar chart component. */
export interface SkyBarChartOptions {
  /**
   * Orientation of the chart.
   */
  orientation?: SkyBarChartOrientation;

  /**
   * The data series for the chart.
   */
  series: SkyChartSeries<SkyBarChartPoint>[];

  /**
   * Whether the chart should display stacked series.
   */
  stacked?: boolean;

  /**
   * Configuration for the category axis.
   */
  categoryAxis?: SkyChartCategoryAxisConfig;

  /**
   * Configuration for the measure axis.
   */
  measureAxis?: SkyChartMeasureAxisConfig;

  callbacks: {
    onDataPointClick: (event: SkySelectedChartDataPoint) => void;
  };
}

/**
 * Transforms a consumer-friendly SkyBarChartConfig into a ChartJS ChartConfiguration.
 */
export function getChartJsBarChartConfig(
  config: SkyBarChartOptions,
): ChartConfiguration<'bar'> {
  const orientation = config.orientation || 'vertical';
  const isVertical = orientation === 'vertical';

  // Build categories from series data
  const categories = parseCategories(config.series);

  // Build datasets from series
  const datasets = config.series.map((series) => {
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
      label: series.labelText,
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
          const dataset = config.series[datasetIndex];
          const dataPoint = dataset.data[dataIndex];

          // TODO: Chart localization
          return `${dataset.labelText}: ${dataPoint.labelText}`;
        },
      },
    },
  };

  // Build chart options
  const options = mergeChartOptions<'bar'>({
    indexAxis: isVertical ? 'x' : 'y',
    interaction: getInteraction(config),
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
    scales: createScales(config),
    plugins: pluginOptions,
    onClick: (e, _, chart) => {
      if (!e.native) {
        return;
      }

      // Get the chart element(s) at the click location using a precise interaction mode rather than what tooltips use for accuracy
      const hits = chart.getElementsAtEventForMode(
        e.native,
        'nearest',
        { intersect: true },
        true,
      );

      if (!hits?.length) {
        return;
      }

      const element = hits[0];
      const seriesIndex = element.datasetIndex;
      const dataIndex = element.index;

      config.callbacks.onDataPointClick({ seriesIndex, dataIndex });
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
  skyConfig: SkyBarChartOptions,
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
  skyConfig: SkyBarChartOptions,
): ChartOptions<'bar'>['scales'] {
  const orientation = skyConfig.orientation ?? 'vertical';
  const isVertical = orientation === 'vertical';
  const categoryAxis = isVertical ? 'y' : 'x';
  const measureAxis = isVertical ? 'x' : 'y';

  const categoryScale = createCategoryScale(skyConfig, categoryAxis);
  const measureScale = createMeasureScale(skyConfig, measureAxis);

  if (orientation === 'vertical') {
    return { x: categoryScale, y: measureScale };
  } else {
    return { x: measureScale, y: categoryScale };
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
  config: SkyBarChartOptions,
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
      display: !!config.categoryAxis?.labelText,
      text: config.categoryAxis?.labelText ?? '',
      padding: getScaleTitlePadding(axis),
    },
  };

  return categoryScale;
}

function createMeasureScale(
  config: SkyBarChartOptions,
  axis: 'x' | 'y',
): PartialBarScale {
  if (config.measureAxis?.scaleType === 'logarithmic') {
    return createLogarithmicValueScale(config, axis);
  } else {
    return createLinearValueScale(config, axis);
  }
}

function createLinearValueScale(
  config: SkyBarChartOptions,
  axis: 'x' | 'y',
): PartialBarScale {
  const base = getBaseScale();

  const valueScale: PartialBarScale = {
    type: 'linear',
    stacked: config.stacked ?? false,
    beginAtZero: true,
    suggestedMin: config.measureAxis?.suggestedMin,
    suggestedMax: config.measureAxis?.suggestedMax,
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
      // If a tick formatter is provided, use it. Otherwise this syntax allows us to fallback to ChartJS's default formatting.
      ...(config.measureAxis?.tickFormatter && {
        callback: config.measureAxis.tickFormatter,
      }),
    },
    title: {
      ...base.title,
      display: !!config.measureAxis?.labelText,
      text: config.measureAxis?.labelText,
      padding: getScaleTitlePadding(axis),
    },
  };

  return valueScale;
}

function createLogarithmicValueScale(
  config: SkyBarChartOptions,
  axis: 'x' | 'y',
): PartialBarScale {
  const base = getBaseScale();

  const valueScale: PartialBarScale = {
    type: 'logarithmic',
    stacked: config.stacked ?? false,
    suggestedMin: config.measureAxis?.suggestedMin,
    suggestedMax: config.measureAxis?.suggestedMax,
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
      // If a tick formatter is provided, use it. Otherwise this syntax allows us to fallback to ChartJS's default formatting.
      ...(config.measureAxis?.tickFormatter && {
        callback: config.measureAxis.tickFormatter,
      }),
    },
    title: {
      ...base.title,
      display: !!config.measureAxis?.labelText,
      text: config.measureAxis?.labelText,
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

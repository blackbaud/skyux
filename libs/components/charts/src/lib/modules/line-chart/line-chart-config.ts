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

import { SkyLineChartPoint } from './line-chart-types';

/** Configuration for the line chart component. */
export interface SkyLineChartOptions {
  /**
   * The data series for the chart.
   */
  series: SkyChartSeries<SkyLineChartPoint>[];

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
 * Transforms a consumer-friendly SkyLineChartConfig into a ChartJS ChartConfiguration.
 */
export function getChartJsLineChartConfig(
  config: SkyLineChartOptions,
): ChartConfiguration<'line'> {
  // Build categories from series data
  const categories = parseCategories(config.series);

  // Build datasets from series
  const datasets = config.series.map((series) => {
    const byCategory = new Map<SkyCategory, number | null>();

    for (const p of series.data) {
      byCategory.set(p.category, p.value);
    }

    const data: (number | null)[] = categories.map((category) => {
      return byCategory.get(category) ?? null;
    });

    const dataset: ChartDataset<'line'> = {
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
          const dataset = config.series[datasetIndex];
          const dataPoint = dataset.data[dataIndex];

          // TODO: Chart Localization
          return `${dataset.label}: ${dataPoint.label}`;
        },
      },
    },
  };

  // Build ChartJS options
  const options = mergeChartOptions<'line'>({
    indexAxis: 'x',
    elements: {
      line: {
        tension: SkyuxChartStyles.lineTension,
        borderWidth: SkyuxChartStyles.lineBorderWidth,
      },
      point: {
        radius: SkyuxChartStyles.linePointRadius,
        hoverRadius: SkyuxChartStyles.linePointHoverRadius,
        borderWidth: SkyuxChartStyles.linePointBorderWidth,
        hoverBorderWidth: SkyuxChartStyles.linePointBorderWidth,
        pointStyle: 'circle',
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
    type: 'line',
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

type PartialLineScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['line']['scales']>
>;

/**
 * Creates the scales configuration for the line chart.
 * @param config
 * @returns
 */
function createScales(
  config: SkyLineChartOptions,
): ChartOptions<'line'>['scales'] {
  const categoryScale = createCategoryScale(config);
  const measureScale = createMeasureScale(config);

  return { x: categoryScale, y: measureScale };
}

function getBaseScale(): PartialLineScale {
  const base: PartialLineScale = {
    grid: {
      display: true,
      color: SkyuxChartStyles.axisGridLineColor,
      tickColor: SkyuxChartStyles.axisGridLineColor,
      drawTicks: true,
      tickLength: SkyuxChartStyles.axisTickLength,
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
      display: true,
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

  return base;
}

function createCategoryScale(config: SkyLineChartOptions): PartialLineScale {
  const base = getBaseScale();

  const categoryScale: PartialLineScale = {
    type: 'category',
    stacked: config.stacked ?? false,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingX,
    },
    title: {
      ...base.title,
      display: !!config.categoryAxis?.label,
      text: config.categoryAxis?.label,
      padding: getScaleTitlePadding('x'),
    },
  };

  return categoryScale;
}

function createMeasureScale(config: SkyLineChartOptions): PartialLineScale {
  if (config.measureAxis?.scaleType === 'logarithmic') {
    return createLogarithmicValueScale(config);
  } else {
    return createLinearValueScale(config);
  }
}

function createLinearValueScale(config: SkyLineChartOptions): PartialLineScale {
  const base = getBaseScale();

  const valueScale: PartialLineScale = {
    type: 'linear',
    stacked: config.stacked ?? false,
    suggestedMin: config.measureAxis?.suggestedMin,
    suggestedMax: config.measureAxis?.suggestedMax,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
      // TODO: Chart localization
      callback: config.measureAxis?.tickFormatter,
    },
    title: {
      ...base.title,
      display: !!config.measureAxis?.label,
      text: config.measureAxis?.label,
      padding: getScaleTitlePadding('y'),
    },
  };

  return valueScale;
}

function createLogarithmicValueScale(
  config: SkyLineChartOptions,
): PartialLineScale {
  const base = getBaseScale();

  const valueScale: PartialLineScale = {
    type: 'logarithmic',
    stacked: config.stacked ?? false,
    suggestedMin: config.measureAxis?.suggestedMin,
    suggestedMax: config.measureAxis?.suggestedMax,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
      // TODO: Chart localization
      callback: config.measureAxis?.tickFormatter,
    },
    title: {
      ...base.title,
      display: !!config.measureAxis?.label,
      text: config.measureAxis?.label,
      padding: getScaleTitlePadding('y'),
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

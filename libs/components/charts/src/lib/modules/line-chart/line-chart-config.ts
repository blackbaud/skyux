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

import { SkyLineChartConfig } from './line-chart-types';

/**
 * Transforms a consumer-friendly SkyLineChartConfig into a ChartJS ChartConfiguration.
 */
export function getChartJsLineChartConfig(
  skyConfig: SkyLineChartConfig,
  callbacks: {
    onDataPointClick: (event: SkySelectedChartDataPoint) => void;
  },
): ChartConfiguration<'line'> {
  // Build categories from series data
  const categories = parseCategories(skyConfig.series);

  // Build datasets from series
  const datasets = skyConfig.series.map((series) => {
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
          const dataset = skyConfig.series[datasetIndex];
          const dataPoint = dataset.data[dataIndex];

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
  config: SkyLineChartConfig,
): ChartOptions<'line'>['scales'] {
  const categoryScale = createCategoryScale(config);
  const valueScale = createValueScale(config);

  return { x: categoryScale, y: valueScale };
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

function createCategoryScale(config: SkyLineChartConfig): PartialLineScale {
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

function createValueScale(config: SkyLineChartConfig): PartialLineScale {
  if (config.valueAxis?.scaleType === 'logarithmic') {
    return createLogarithmicValueScale(config);
  } else {
    return createLinearValueScale(config);
  }
}

function createLinearValueScale(config: SkyLineChartConfig): PartialLineScale {
  const base = getBaseScale();

  const valueScale: PartialLineScale = {
    type: 'linear',
    stacked: config.stacked ?? false,
    suggestedMin: config.valueAxis?.suggestedMin,
    suggestedMax: config.valueAxis?.suggestedMax,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
      callback: config.valueAxis?.tickFormatter,
    },
    title: {
      ...base.title,
      display: !!config.valueAxis?.label,
      text: config.valueAxis?.label,
      padding: getScaleTitlePadding('y'),
    },
  };

  return valueScale;
}

function createLogarithmicValueScale(
  config: SkyLineChartConfig,
): PartialLineScale {
  const base = getBaseScale();

  const valueScale: PartialLineScale = {
    type: 'logarithmic',
    stacked: config.stacked ?? false,
    suggestedMin: config.valueAxis?.suggestedMin,
    suggestedMax: config.valueAxis?.suggestedMax,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
      callback: config.valueAxis?.tickFormatter,
    },
    title: {
      ...base.title,
      display: !!config.valueAxis?.label,
      text: config.valueAxis?.label,
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

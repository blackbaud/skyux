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
  SkyCategory,
  SkyChartDataPointClickEvent,
} from '../shared/chart-types';
import { DeepPartial } from '../shared/deep-partial-type';
import { mergeChartConfig } from '../shared/global-chart-config';
import { createAutoColorPlugin } from '../shared/plugins/auto-color-plugin';
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';

import { SkyLineChartConfig } from './line-chart-types';

/**
 * Transforms a consumer-friendly SkyLineChartConfig into a ChartJS ChartConfiguration.
 * This function encapsulates all ChartJS implementation details and provides
 * a clean mapping from the public API to the internal representation.
 */
export function getChartJsLineChartConfig(
  config: SkyLineChartConfig,
  callbacks: {
    onDataPointClick: (event: SkyChartDataPointClickEvent) => void;
  },
): ChartConfiguration<'line'> {
  const orientation = config.orientation || 'vertical';
  const isVertical = orientation === 'vertical';

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
  const pluginOptions: ChartOptions['plugins'] = {};

  if (config.title) {
    pluginOptions.title = { display: true, text: config.title };
  }

  if (config.subtitle) {
    pluginOptions.subtitle = { display: true, text: config.subtitle };
  }

  // Build ChartJS options
  const options = mergeChartConfig<'line'>({
    indexAxis: isVertical ? 'x' : 'y',
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
    plugins: [createAutoColorPlugin(), createTooltipShadowPlugin()],
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
  const orientation = config.orientation ?? 'vertical';

  const categoryScale = createCategoryScale(config);
  const valueScale = createValueScale(config);

  if (orientation === 'vertical') {
    return { x: categoryScale, y: valueScale };
  } else {
    return { x: valueScale, y: categoryScale };
  }
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
  const orientation = config.orientation ?? 'vertical';
  const isVertical = orientation === 'vertical';
  const categoryAxis = isVertical ? 'y' : 'x';

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
      padding: {
        top:
          categoryAxis === 'x'
            ? SkyuxChartStyles.scaleXTitlePaddingTop
            : SkyuxChartStyles.scaleYTitlePaddingLeft,
        bottom:
          categoryAxis === 'x'
            ? SkyuxChartStyles.scaleXTitlePaddingBottom
            : SkyuxChartStyles.scaleYTitlePaddingRight,
      },
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
  const orientation = config.orientation ?? 'vertical';
  const isVertical = orientation === 'vertical';
  const valueAxis = isVertical ? 'y' : 'x';

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
    },
    title: {
      ...base.title,
      display: !!config.valueAxis?.label,
      text: config.valueAxis?.label,
      padding: {
        top:
          valueAxis === 'y'
            ? SkyuxChartStyles.scaleYTitlePaddingLeft
            : SkyuxChartStyles.scaleXTitlePaddingTop,
        bottom:
          valueAxis === 'y'
            ? SkyuxChartStyles.scaleYTitlePaddingRight
            : SkyuxChartStyles.scaleXTitlePaddingBottom,
      },
    },
  };

  return valueScale;
}

function createLogarithmicValueScale(
  config: SkyLineChartConfig,
): PartialLineScale {
  const orientation = config.orientation ?? 'vertical';
  const isVertical = orientation === 'vertical';
  const valueAxis = isVertical ? 'y' : 'x';

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
    },
    title: {
      ...base.title,
      display: !!config.valueAxis?.label,
      text: config.valueAxis?.label,
      padding: {
        top:
          valueAxis === 'y'
            ? SkyuxChartStyles.scaleYTitlePaddingLeft
            : SkyuxChartStyles.scaleXTitlePaddingTop,
        bottom:
          valueAxis === 'y'
            ? SkyuxChartStyles.scaleYTitlePaddingRight
            : SkyuxChartStyles.scaleXTitlePaddingBottom,
      },
    },
  };

  return valueScale;
}

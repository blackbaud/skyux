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
import { createTooltipShadowPlugin } from '../shared/plugins/tooltip-shadow-plugin';

import { SkyLineChartConfig } from './line-chart-types';

/**
 * Transforms a consumer-friendly SkyLineChartConfig into a ChartJS ChartConfiguration.
 * This function encapsulates all ChartJS implementation details and provides
 * a clean mapping from the public API to the internal representation.
 */
export function getChartJsLineChartConfig(
  skyConfig: SkyLineChartConfig,
  callbacks: {
    onDataPointClick: (event: SkyChartDataPointClickEvent) => void;
  },
): ChartConfiguration<'line'> {
  const orientation = skyConfig.orientation || 'vertical';
  const isVertical = orientation === 'vertical';

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
  const pluginOptions: ChartOptions['plugins'] = {};

  if (skyConfig.title) {
    pluginOptions.title = { display: true, text: skyConfig.title };
  }

  if (skyConfig.subtitle) {
    pluginOptions.subtitle = { display: true, text: skyConfig.subtitle };
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
    type: 'line',
    data: {
      labels: categories,
      datasets: datasets,
    },
    options: options,
    plugins: [createAutoColorPlugin(), createTooltipShadowPlugin()],
  };
}

type PartialLinearScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['line']['scales']>
>;

// eslint-disable-next-line complexity
function createLinearScales(
  skyConfig: SkyLineChartConfig,
): ChartOptions<'line'>['scales'] {
  const orientation = skyConfig.orientation ?? 'vertical';
  const isVertical = orientation === 'vertical';
  const valueAxis = isVertical ? 'y' : 'x';
  const categoryAxis = isVertical ? 'y' : 'x';

  const base: PartialLinearScale = {
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

  const categoryScale: PartialLinearScale = {
    type: 'category',
    stacked: skyConfig.stacked ?? false,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingX,
    },
    title: {
      ...base.title,
      display: !!skyConfig.categoryAxis?.label,
      text: skyConfig.categoryAxis?.label,
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

  const valueScale: PartialLinearScale = {
    type: 'linear',
    stacked: skyConfig.stacked ?? false,
    suggestedMin: skyConfig.valueAxis?.suggestedMin,
    suggestedMax: skyConfig.valueAxis?.suggestedMax,
    grid: base.grid,
    border: base.border,
    ticks: {
      ...base.ticks,
      padding: SkyuxChartStyles.axisTickPaddingY,
    },
    title: {
      ...base.title,
      display: !!skyConfig.valueAxis?.label,
      text: skyConfig.valueAxis?.label,
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

  if (isVertical) {
    return { x: categoryScale, y: valueScale };
  } else {
    return { x: valueScale, y: valueScale };
  }
}

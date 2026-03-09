import { Injectable, inject } from '@angular/core';

import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartTypeRegistry,
  ScaleOptionsByType,
} from 'chart.js';

import {
  getActivatedChartDataElement,
  parseCategories,
} from '../shared/chart-helpers';
import {
  SkyChartStyleService,
  SkyChartStyles,
} from '../shared/services/chart-style.service';
import { SkyChartGlobalConfigService } from '../shared/services/global-chart-config.service';
import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';
import { SkyCategory } from '../shared/types/category';
import { SkyChartActivatedDatapoint } from '../shared/types/chart-activated-datapoint';
import { SkyChartSeries } from '../shared/types/chart-series';
import { DeepPartial } from '../shared/types/deep-partial-type';

import { SkyBarChartOrientation, SkyBarChartPoint } from './bar-chart-types';

/**
 * Configuration service for the Bar Chart component.
 */
@Injectable({ providedIn: 'root' })
export class SkyBarChartConfigService {
  readonly #chartStyleService = inject(SkyChartStyleService);
  readonly #globalConfig = inject(SkyChartGlobalConfigService);

  /**
   * Builds a Chart.js Bar Chart configuration based on provided options.
   * @remarks This uses the `SkyChartStyleService.styles` signal to support runtime theming recalculations
   * @param options bar chart options
   */
  public buildConfig(options: SkyBarChartOptions): ChartConfiguration<'bar'> {
    const styles = this.#chartStyleService.styles();

    const orientation = options.orientation || 'vertical';
    const isVertical = orientation === 'vertical';

    // Build categories from series data
    const categories = parseCategories(options.series);

    // Build datasets from series
    const datasets: ChartDataset<'bar'>[] = options.series.map((series) => {
      const byCategory = new Map<
        SkyCategory,
        number | [number, number] | null
      >();

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
    const pluginOptions: ChartOptions<'bar'>['plugins'] = {
      tooltip: {
        callbacks: {
          label: function (context) {
            const { datasetIndex, dataIndex } = context;
            const dataset = options.series[datasetIndex];
            const dataPoint = dataset.data[dataIndex];

            // TODO: Chart localization
            return `${dataset.labelText}: ${dataPoint.labelText}`;
          },
        },
      },
    };

    // Build chart options
    const chartOptions: ChartOptions<'bar'> = {
      indexAxis: isVertical ? 'x' : 'y',
      interaction: this.#getInteraction(options),
      datasets: {
        bar: {
          categoryPercentage: 0.7,
          // barPercentage: 0.7,
        },
      },
      elements: {
        bar: {
          borderWidth: styles.charts.bar.borderWidth,
          borderColor: styles.charts.bar.borderColor,
          borderRadius: styles.charts.bar.borderRadius,
        },
      },
      scales: this.#createScales(styles, options),
      plugins: pluginOptions,
      onClick: (e, _, chart) => {
        const clickedElement = getActivatedChartDataElement(e, chart);
        if (!clickedElement) {
          return;
        }
        options.callbacks.onDatapointClick(clickedElement);
      },
    };

    const config = this.#globalConfig.getMergedChartConfiguration<'bar'>({
      type: 'bar',
      data: { labels: categories, datasets: datasets },
      options: chartOptions,
    });

    return config;
  }

  #getInteraction(options: SkyBarChartOptions): ChartOptions['interaction'] {
    const interaction: ChartOptions['interaction'] = {
      mode: 'nearest',
      intersect: false,
      axis: 'x',
    };

    if (options.orientation === 'vertical') {
      interaction.axis = 'x';
    }

    if (options.orientation === 'horizontal') {
      interaction.axis = 'y';
    }

    if (options.series.length > 1) {
      interaction.axis = 'xy';
    }

    return interaction;
  }

  #createScales(
    styles: SkyChartStyles,
    options: SkyBarChartOptions,
  ): ChartOptions<'bar'>['scales'] {
    const orientation = options.orientation ?? 'vertical';
    const isVertical = orientation === 'vertical';
    const categoryAxis = isVertical ? 'y' : 'x';
    const measureAxis = isVertical ? 'x' : 'y';

    const categoryScale = this.#createCategoryScale(
      styles,
      options,
      categoryAxis,
    );
    const measureScale = this.#createMeasureScale(styles, options, measureAxis);

    if (orientation === 'vertical') {
      return { x: categoryScale, y: measureScale };
    } else {
      return { x: measureScale, y: categoryScale };
    }
  }

  #getBaseScale(styles: SkyChartStyles): PartialBarScale {
    const base: PartialBarScale = {
      border: {
        display: true,
        color: styles.axis.lineColor,
      },
      ticks: {
        color: styles.axis.ticks.color,
        font: {
          size: styles.axis.ticks.fontSize,
          family: styles.fontFamily,
          weight: styles.axis.ticks.fontWeight,
        },
        major: { enabled: true },
      },
      title: {
        display: true,
        font: {
          size: styles.scale.titleFontSize,
          family: styles.scale.titleFontFamily,
        },
        color: styles.scale.titleColor,
      },
    };

    return base;
  }

  #createCategoryScale(
    styles: SkyChartStyles,
    options: SkyBarChartOptions,
    axis: 'x' | 'y',
  ): PartialBarScale {
    const base = this.#getBaseScale(styles);

    const categoryScale: PartialBarScale = {
      type: 'category',
      stacked: options.stacked ?? false,
      grid: {
        display: false,
        lineWidth: 0,
        drawTicks: false,
        tickLength: 0,
      },
      border: base.border,
      ticks: {
        ...base.ticks,
        padding: styles.axis.ticks.paddingX,
      },
      title: {
        ...base.title,
        display: !!options.categoryAxis?.labelText,
        text: options.categoryAxis?.labelText ?? '',
        padding: this.#getScaleTitlePadding(styles, axis),
      },
    };

    return categoryScale;
  }

  #createMeasureScale(
    styles: SkyChartStyles,
    options: SkyBarChartOptions,
    axis: 'x' | 'y',
  ): PartialBarScale {
    if (options.measureAxis?.scaleType === 'logarithmic') {
      return this.#createLogarithmicMeasureScale(styles, options, axis);
    } else {
      return this.#createLinearMeasureScale(styles, options, axis);
    }
  }

  #createLinearMeasureScale(
    styles: SkyChartStyles,
    options: SkyBarChartOptions,
    axis: 'x' | 'y',
  ): PartialBarScale {
    const base = this.#getBaseScale(styles);

    const valueScale: PartialBarScale = {
      type: 'linear',
      stacked: options.stacked ?? false,
      beginAtZero: true,
      suggestedMin: options.measureAxis?.suggestedMin,
      suggestedMax: options.measureAxis?.suggestedMax,
      grid: {
        display: true,
        color: styles.axis.gridLineColor,
        tickColor: styles.axis.gridLineColor,
        drawTicks: true,
        tickLength: styles.axis.ticks.length,
      },
      border: base.border,
      ticks: {
        ...base.ticks,
        padding: styles.axis.ticks.paddingY,
        // TODO: Chart localization
        // If a tick formatter is provided, use it. Otherwise this syntax allows us to fallback to ChartJS's default formatting.
        ...(options.measureAxis?.tickFormatter && {
          callback: options.measureAxis.tickFormatter,
        }),
      },
      title: {
        ...base.title,
        display: !!options.measureAxis?.labelText,
        text: options.measureAxis?.labelText,
        padding: this.#getScaleTitlePadding(styles, axis),
      },
    };

    return valueScale;
  }

  #createLogarithmicMeasureScale(
    styles: SkyChartStyles,
    options: SkyBarChartOptions,
    axis: 'x' | 'y',
  ): PartialBarScale {
    const base = this.#getBaseScale(styles);

    const valueScale: PartialBarScale = {
      type: 'logarithmic',
      stacked: options.stacked ?? false,
      suggestedMin: options.measureAxis?.suggestedMin,
      suggestedMax: options.measureAxis?.suggestedMax,
      grid: {
        display: true,
        color: styles.axis.gridLineColor,
        tickColor: styles.axis.gridLineColor,
        drawTicks: true,
        tickLength: styles.axis.ticks.length,
      },
      border: base.border,
      ticks: {
        ...base.ticks,
        padding: styles.axis.ticks.paddingY,
        // TODO: Chart localization
        // If a tick formatter is provided, use it. Otherwise this syntax allows us to fallback to ChartJS's default formatting.
        ...(options.measureAxis?.tickFormatter && {
          callback: options.measureAxis.tickFormatter,
        }),
      },
      title: {
        ...base.title,
        display: !!options.measureAxis?.labelText,
        text: options.measureAxis?.labelText,
        padding: this.#getScaleTitlePadding(styles, axis),
      },
    };

    return valueScale;
  }

  #getScaleTitlePadding(
    styles: SkyChartStyles,
    axis: 'x' | 'y',
  ): { top: number; bottom: number } {
    if (axis === 'x') {
      return {
        top: styles.scale.titleXPaddingTop,
        bottom: styles.scale.titleXPaddingBottom,
      };
    } else {
      return {
        top: styles.scale.titleYPaddingLeft,
        bottom: styles.scale.titleYPaddingRight,
      };
    }
  }
}

// #region Types
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
    onDatapointClick: (event: SkyChartActivatedDatapoint) => void;
  };
}

type PartialBarScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['bar']['scales']>
>;
// #endregion

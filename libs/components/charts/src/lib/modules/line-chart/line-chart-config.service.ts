import { Injectable, inject } from '@angular/core';

import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartTypeRegistry,
  ScaleOptionsByType,
} from 'chart.js';

import {
  createLogTickFilter,
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

import { SkyLineChartPoint } from './line-chart-types';

/**
 * Configuration service for the Line Chart component.
 */
@Injectable({ providedIn: 'root' })
export class SkyLineChartConfigService {
  readonly #chartStyleService = inject(SkyChartStyleService);
  readonly #globalConfig = inject(SkyChartGlobalConfigService);

  /**
   * Builds a Chart.js Line Chart configuration based on provided options.
   * @remarks This uses the `SkyChartStyleService.styles` signal to support runtime theming recalculations
   * @param options bar chart options
   */
  public buildConfig(options: SkyLineChartOptions): ChartConfiguration<'line'> {
    const styles = this.#chartStyleService.styles();

    // Build categories from series data
    const categories = parseCategories(options.series);

    // Build datasets from series
    const datasets: ChartDataset<'line'>[] = options.series.map((series) => {
      const byCategory = new Map<SkyCategory, number | null>();

      for (const p of series.data) {
        byCategory.set(p.category, p.value);
      }

      const data: (number | null)[] = categories.map((category) => {
        return byCategory.get(category) ?? null;
      });

      const dataset: ChartDataset<'line'> = {
        label: series.labelText,
        data: data,
      };

      return dataset;
    });

    // Build Plugin options
    const pluginOptions: ChartOptions<'line'>['plugins'] = {
      tooltip: {
        callbacks: {
          label: function (context) {
            const { datasetIndex, dataIndex } = context;
            const dataset = options.series[datasetIndex];
            const dataPoint = dataset.data[dataIndex];

            // TODO: Chart Localization
            return `${dataset.labelText}: ${dataPoint.labelText}`;
          },
        },
      },
    };

    // Build ChartJS options
    const chartOptions: ChartOptions<'line'> = {
      indexAxis: 'x',
      elements: {
        line: {
          tension: styles.charts.line.tension,
          borderWidth: styles.charts.line.borderWidth,
        },
        point: {
          radius: styles.charts.line.pointRadius,
          hoverRadius: styles.charts.line.pointHoverRadius,
          borderWidth: styles.charts.line.pointBorderWidth,
          hoverBorderWidth: styles.charts.line.pointBorderWidth,
          pointStyle: 'circle',
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

    const config = this.#globalConfig.getMergedChartConfiguration<'line'>({
      type: 'line',
      data: { labels: categories, datasets: datasets },
      options: chartOptions,
    });

    return config;
  }

  #createScales(
    styles: SkyChartStyles,
    config: SkyLineChartOptions,
  ): ChartOptions<'line'>['scales'] {
    const categoryScale = this.#createCategoryScale(styles, config);
    const measureScale = this.#createMeasureScale(styles, config);

    return { x: categoryScale, y: measureScale };
  }

  #getBaseScale(styles: SkyChartStyles): PartialLineScale {
    const base: PartialLineScale = {
      grid: {
        display: true,
        color: styles.axis.grid.color,
        tickColor: styles.axis.grid.color,
        drawTicks: true,
        tickLength: styles.axis.ticks.length,
      },
      border: {
        display: true,
        color: styles.axis.border.color,
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
    config: SkyLineChartOptions,
  ): PartialLineScale {
    const base = this.#getBaseScale(styles);

    const categoryScale: PartialLineScale = {
      type: 'category',
      stacked: config.stacked ?? false,
      grid: base.grid,
      border: base.border,
      ticks: {
        ...base.ticks,
        padding: styles.axis.ticks.paddingX,
      },
      title: {
        ...base.title,
        display: !!config.categoryAxis?.labelText,
        text: config.categoryAxis?.labelText,
        padding: this.#getScaleTitlePadding(styles, 'x'),
      },
    };

    return categoryScale;
  }

  #createMeasureScale(
    styles: SkyChartStyles,
    config: SkyLineChartOptions,
  ): PartialLineScale {
    if (config.measureAxis?.scaleType === 'logarithmic') {
      return this.#createLogarithmicMeasureScale(styles, config);
    } else {
      return this.#createLinearMeasureScale(styles, config);
    }
  }

  #createLinearMeasureScale(
    styles: SkyChartStyles,
    config: SkyLineChartOptions,
  ): PartialLineScale {
    const base = this.#getBaseScale(styles);

    const valueScale: PartialLineScale = {
      type: 'linear',
      stacked: config.stacked ?? false,
      suggestedMin: config.measureAxis?.suggestedMin,
      suggestedMax: config.measureAxis?.suggestedMax,
      grid: base.grid,
      border: base.border,
      ticks: {
        ...base.ticks,
        padding: styles.axis.ticks.paddingY,
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
        padding: this.#getScaleTitlePadding(styles, 'y'),
      },
    };

    return valueScale;
  }

  #createLogarithmicMeasureScale(
    styles: SkyChartStyles,
    config: SkyLineChartOptions,
  ): PartialLineScale {
    const base = this.#getBaseScale(styles);

    const valueScale: PartialLineScale = {
      type: 'logarithmic',
      stacked: config.stacked ?? false,
      suggestedMin: config.measureAxis?.suggestedMin,
      suggestedMax: config.measureAxis?.suggestedMax,
      grid: {
        ...base.grid,
        lineWidth: (ctx) => {
          const tick = ctx.tick;
          return !tick?.label ? 0 : styles.axis.grid.width;
        },
      },
      border: base.border,
      ticks: {
        ...base.ticks,
        padding: styles.axis.ticks.paddingY,
        // TODO: Chart localization
        callback: value => createLogTickFilter(value, config.measureAxis?.tickFormatter),
      },
      title: {
        ...base.title,
        display: !!config.measureAxis?.labelText,
        text: config.measureAxis?.labelText,
        padding: this.#getScaleTitlePadding(styles, 'y'),
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
    onDatapointClick: (event: SkyChartActivatedDatapoint) => void;
  };
}

type PartialLineScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['line']['scales']>
>;
// #endregion

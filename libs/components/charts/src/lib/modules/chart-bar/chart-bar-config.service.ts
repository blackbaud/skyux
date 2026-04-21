import { Injectable, inject } from '@angular/core';

import {
  BarControllerDatasetOptions,
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartTypeRegistry,
  ScaleOptionsByType,
} from 'chart.js';

import { parseCategories } from '../shared/chart-helpers';
import {
  buildCategoryScale,
  buildLinearMeasureScale,
  buildLogarithmicMeasureScale,
} from '../shared/scale-mapping';
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
import type { SkyChartDataPointClickArgs } from '../shared/types/chart-data-point-click-args';
import { SkyChartSeries } from '../shared/types/chart-series';
import { DeepPartial } from '../shared/types/deep-partial-type';

import {
  SkyChartBarDatum,
  SkyChartBarOrientation,
  SkyChartBarPoint,
} from './chart-bar-types';

/**
 * Configuration service for the Bar Chart component.
 */
@Injectable({ providedIn: 'root' })
export class SkyChartBarConfigService {
  readonly #chartStyleService = inject(SkyChartStyleService);
  readonly #globalConfig = inject(SkyChartGlobalConfigService);

  /**
   * Builds a Chart.js Bar Chart configuration based on provided options.
   * @remarks This uses the `SkyChartStyleService.styles` signal to support runtime theming recalculations
   * @param options The bar chart options
   */
  public buildConfig(options: SkyChartBarOptions): ChartConfiguration<'bar'> {
    const styles = this.#chartStyleService.styles();

    const orientation = options.orientation || 'vertical';
    const isVertical = orientation === 'vertical';

    // Build categories from series data
    const categories = parseCategories(options.series);

    // Build datasets from series
    const datasets: ChartDataset<'bar'>[] = options.series.map((series) => {
      const dataByCategory = new Map<SkyCategory, SkyChartBarDatum>();

      for (const p of series.data) {
        dataByCategory.set(p.category, p.value);
      }

      // Backfill null for categories missing from this series
      const data = categories.map((category) => {
        return dataByCategory.get(category) ?? null;
      });

      const dataset: ChartDataset<'bar'> = {
        label: series.labelText,
        data: data,
      };

      return dataset;
    });

    // Build Plugin options
    const pluginOptions: ChartOptions<'bar'>['plugins'] = {
      sky_indicator: { dataPointsClickEnabled: options.dataPointsClickEnabled },
      sky_keyboard_nav: {
        valueLabel: (datasetIndex, dataIndex) => {
          const series = options.series[datasetIndex];
          const category = categories[dataIndex];
          const dataPoint = series.data.find((d) => d.category === category);
          const label = dataPoint?.labelText ?? '';
          return label;
        },
      },
      tooltip: {
        intersect: false,
        callbacks: {
          label: function (context) {
            const series = options.series[context.datasetIndex];
            const category = categories[context.dataIndex];
            const dataPoint = series.data.find((d) => d.category === category);
            return `${series.labelText}: ${dataPoint?.labelText}`;
          },
        },
      },
    };

    // Build chart options
    const chartOptions: ChartOptions<'bar'> = {
      indexAxis: isVertical ? 'x' : 'y',
      interaction: {
        mode: options.series.length > 1 ? 'nearest' : 'index',
        intersect: true,
        axis: options.orientation === 'vertical' ? 'x' : 'y',
      },
      datasets: {
        bar: this.#getBarDatasetOptions(options, categories.length, styles),
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
      onClick: (_, elements): void => {
        if (
          !options.dataPointsClickEnabled ||
          !options.callbacks?.onDataPointClick ||
          elements.length === 0
        ) {
          return;
        }

        const element = elements[0];
        const series = options.series[element.datasetIndex];
        const category = categories[element.index];
        const dataPoint = series.data.find((d) => d.category === category);

        if (dataPoint) {
          options.callbacks.onDataPointClick({
            series: series.labelText,
            category: category,
            value: dataPoint.value,
          });
        }
      },
    };

    const config = this.#globalConfig.getMergedChartConfiguration<'bar'>({
      type: 'bar',
      data: { labels: categories, datasets: datasets },
      options: chartOptions,
      plugins: [],
    });

    return config;
  }

  /**
   * Calculates the appropriate height for a horizontal bar chart.
   * @param options The bar chart options
   * @returns A CSS height value (e.g. '400px') for the chart container
   */
  public getChartHeight(options: SkyChartBarOptions): string {
    const styles = this.#chartStyleService.styles();

    if (options.orientation === 'vertical') {
      return styles.height.default;
    }

    const seriesCount = options.series.length;
    const categoryCount = parseCategories(options.series).length;
    const containerHeightMin = this.#chartStyleService.styles().height.min;
    const barsPerCategory = options.stacked ? 1 : seriesCount;
    const totalBars = categoryCount * barsPerCategory;

    const spacing = this.#computeHorizontalBarElementSpacing(totalBars, styles);
    const { barThickness, categoryGap } = spacing;
    const rowHeight = barThickness * barsPerCategory + categoryGap;
    const totalRowsHeight = categoryCount * rowHeight;

    const computedHeight = this.#computeChartOverhead(styles) + totalRowsHeight;

    // Allow horizontal bar charts to grow indefinitely but clamp them from being too small
    const clampedHeight = Math.max(containerHeightMin, computedHeight);

    return `${clampedHeight}px`;
  }

  // #region Bar Element sizing
  #getBarDatasetOptions(
    options: SkyChartBarOptions,
    categoryCount: number,
    styles: SkyChartStyles,
  ): DeepPartial<BarControllerDatasetOptions> {
    if (options.orientation === 'vertical') {
      const isFewBars = categoryCount <= 3;
      const isManyBars = categoryCount >= 12;

      // Category Percentage is the proportion of the category slot allocated to bars.
      const categoryPercentage = isFewBars ? 0.4 : isManyBars ? 0.95 : 0.7;

      // Bar Percentage is the proportion of the allocated category space that each bar occupies.
      const barPercentage = 0.85;

      return {
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage,
        maxBarThickness: styles.charts.bar.vertical.maxBarThickness,
      };
    }

    const barsPerCategory = options.stacked ? 1 : options.series.length;
    const totalBars = categoryCount * barsPerCategory;
    const spacing = this.#computeHorizontalBarElementSpacing(totalBars, styles);

    return { barThickness: spacing.barThickness };
  }

  /**
   * Returns the Bar Thickness (px) and Category Gap (px) for a horizontal bar chart.
   * @param totalBars The total bars in the horizontal bar chart
   * @param styles    The chart styles
   */
  #computeHorizontalBarElementSpacing(
    totalBars: number,
    styles: SkyChartStyles,
  ): {
    barThickness: number;
    categoryGap: number;
  } {
    const barStyles = styles.charts.bar.horizontal;
    const tuning = {
      minBarThickness: barStyles.minBarThickness,
      maxBarThickness: barStyles.maxBarThickness,
      taperingStart: 12,
      taperingStop: 36,
      minCategoryGap: barStyles.minCategoryGap,
      lowCategoryGapPercentage: 0.375,
      highCategoryGapPercentage: 0.75,
    };

    let barThickness = 0;
    let categoryGapPercentage = 0;

    // Calculate the Bar Thickness and Category Gap %
    if (totalBars < tuning.taperingStart) {
      barThickness = tuning.maxBarThickness;
      categoryGapPercentage = tuning.lowCategoryGapPercentage;
    } else {
      const taperRange = tuning.taperingStop - tuning.taperingStart;
      const rawTaperFraction = (totalBars - tuning.taperingStart) / taperRange;
      const taperFraction = Math.min(1, rawTaperFraction);

      const thicknessRange = tuning.maxBarThickness - tuning.minBarThickness;
      const taperedThickness = Math.round(
        tuning.maxBarThickness - taperFraction * thicknessRange,
      );
      barThickness = Math.max(tuning.minBarThickness, taperedThickness);
      categoryGapPercentage = tuning.highCategoryGapPercentage;
    }

    // Calculate the category gap
    const taperedCategoryGap = barThickness * categoryGapPercentage;
    const categoryGap = Math.max(tuning.minCategoryGap, taperedCategoryGap);

    return { barThickness, categoryGap };
  }

  /**
   * Returns the pixel height consumed by a Chart's non-data elements (padding, axes, titles) based on the provided styles.
   */
  #computeChartOverhead(styles: SkyChartStyles): number {
    const padding = styles.chartPadding * 2;

    const tickHeight =
      Number.parseFloat(styles.axis.ticks.lineHeight) +
      styles.axis.ticks.measureLength +
      styles.axis.ticks.padding;

    const axisTitleHeight =
      styles.axis.title.paddingTop +
      Number.parseFloat(styles.axis.title.lineHeight) +
      styles.axis.title.paddingBottom;

    return padding + tickHeight + axisTitleHeight;
  }
  // #endregion

  // #region Scales
  #createScales(
    styles: SkyChartStyles,
    options: SkyChartBarOptions,
  ): ChartOptions<'bar'>['scales'] {
    const orientation = options.orientation ?? 'vertical';
    const categoryScale = this.#createCategoryScale(styles, options);
    const measureScale = this.#createMeasureScale(styles, options);

    if (orientation === 'vertical') {
      return { x: categoryScale, y: measureScale };
    } else {
      return { x: measureScale, y: categoryScale };
    }
  }

  #createCategoryScale(
    styles: SkyChartStyles,
    options: SkyChartBarOptions,
  ): PartialBarScale {
    const scale = buildCategoryScale({
      styles,
      stacked: options.stacked,
      categoryAxis: options.categoryAxis,
    });

    return {
      ...scale,
      grid: {
        ...scale.grid,
        // Hide grid lines to improve readability
        display: false,
        lineWidth: 0,
        drawTicks: false,
        tickLength: 0,
      },
    };
  }

  #createMeasureScale(
    styles: SkyChartStyles,
    options: SkyChartBarOptions,
  ): PartialBarScale {
    const params = {
      styles: styles,
      stacked: options.stacked ?? false,
      measureAxis: options.measureAxis,
    };

    if (options.measureAxis?.scaleType === 'logarithmic') {
      return buildLogarithmicMeasureScale(params);
    } else {
      return buildLinearMeasureScale(params);
    }
  }
  // #endregion
}

// #region Types
/** Configuration for the bar chart component. */
export interface SkyChartBarOptions {
  /** Orientation of the chart. */
  orientation?: SkyChartBarOrientation;

  /** The data series for the chart. */
  series: SkyChartSeries<SkyChartBarPoint>[];

  /** Whether the chart should display stacked series. */
  stacked?: boolean;

  /** Configuration for the category axis. */
  categoryAxis?: SkyChartCategoryAxisConfig;

  /** Configuration for the measure axis. */
  measureAxis?: SkyChartMeasureAxisConfig;

  /** Are the data points clickable */
  dataPointsClickEnabled: boolean;

  callbacks?: {
    onDataPointClick: (
      event: SkyChartDataPointClickArgs<SkyChartBarDatum>,
    ) => void;
  };
}

type PartialBarScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['bar']['scales']>
>;
// #endregion

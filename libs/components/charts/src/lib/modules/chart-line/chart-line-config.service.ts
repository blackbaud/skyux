import { Injectable, inject } from '@angular/core';

import {
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

import { SkyChartLineDatum, SkyChartLinePoint } from './chart-line-types';

/**
 * Configuration service for the Line Chart component.
 */
@Injectable({ providedIn: 'root' })
export class SkyChartLineConfigService {
  readonly #chartStyleService = inject(SkyChartStyleService);
  readonly #globalConfig = inject(SkyChartGlobalConfigService);

  /**
   * Builds a Chart.js Line Chart configuration based on provided options.
   * @remarks This uses the `SkyChartStyleService.styles` signal to support runtime theming recalculations
   * @param options bar chart options
   */
  public buildConfig(options: SkyChartLineOptions): ChartConfiguration<'line'> {
    const styles = this.#chartStyleService.styles();

    // Build categories from series data
    const categories = parseCategories(options.series);

    // Build datasets from series
    const datasets: ChartDataset<'line'>[] = options.series.map((series) => {
      const dataByCategory = new Map<SkyCategory, SkyChartLineDatum>();

      for (const p of series.data) {
        dataByCategory.set(p.category, p.value);
      }

      // Backfill null for categories missing from this series
      const data = categories.map((category) => {
        return dataByCategory.get(category) ?? null;
      });

      const dataset: ChartDataset<'line'> = {
        label: series.labelText,
        data: data,
      };

      return dataset;
    });

    // Build Plugin options
    const pluginOptions: ChartOptions<'line'>['plugins'] = {
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

    // Build ChartJS options
    const chartOptions: ChartOptions<'line'> = {
      indexAxis: 'x',
      interaction: {
        mode: 'index',
        intersect: true,
        axis: 'xy',
      },
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

    const config = this.#globalConfig.getMergedChartConfiguration<'line'>({
      type: 'line',
      data: { labels: categories, datasets: datasets },
      options: chartOptions,
      plugins: [],
    });

    return config;
  }

  /**
   * Gets the appropriate height for a line chart.
   * @returns A CSS height value (e.g. '400px') for the chart container
   */
  public getChartHeight(): string {
    const styles = this.#chartStyleService.styles();
    return styles.height.default;
  }

  #createScales(
    styles: SkyChartStyles,
    config: SkyChartLineOptions,
  ): ChartOptions<'line'>['scales'] {
    const categoryScale = buildCategoryScale({
      styles: styles,
      stacked: config.stacked,
      categoryAxis: config.categoryAxis,
    });

    const measureScale = this.#createMeasureScale(styles, config);

    return { x: categoryScale, y: measureScale };
  }

  #createMeasureScale(
    styles: SkyChartStyles,
    config: SkyChartLineOptions,
  ): PartialLineScale {
    const params = {
      styles,
      stacked: config.stacked ?? false,
      measureAxis: config.measureAxis,
    };

    if (config.measureAxis?.scaleType === 'logarithmic') {
      return buildLogarithmicMeasureScale(params);
    } else {
      return buildLinearMeasureScale(params);
    }
  }
}

// #region Types
/** Configuration for the line chart component. */
export interface SkyChartLineOptions {
  /** The data series for the chart. */
  series: SkyChartSeries<SkyChartLinePoint>[];

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
      event: SkyChartDataPointClickArgs<SkyChartLineDatum>,
    ) => void;
  };
}

type PartialLineScale = DeepPartial<
  ScaleOptionsByType<ChartTypeRegistry['line']['scales']>
>;
// #endregion

import { Injectable, inject } from '@angular/core';

import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  TooltipItem,
} from 'chart.js';

import { SkyChartStyleService } from '../shared/services/chart-style.service';
import { SkyChartGlobalConfigService } from '../shared/services/global-chart-config.service';
import { SkyChartActivatedDatapoint } from '../shared/types/chart-activated-datapoint';
import { SkyChartSeries } from '../shared/types/chart-series';

import { SkyDonutChartSlice, SkyDonutDatum } from './donut-chart-types';

/**
 * Configuration service for the Donut Chart component.
 */
@Injectable({ providedIn: 'root' })
export class SkyDonutChartConfigService {
  readonly #chartStyleService = inject(SkyChartStyleService);
  readonly #globalConfig = inject(SkyChartGlobalConfigService);

  /**
   * Builds a Chart.js Donut Chart configuration based on provided options.
   * @remarks This uses the `SkyChartStyleService.styles` signal to support runtime theming recalculations
   * @param options bar chart options
   */
  public buildConfig(
    options: SkyDonutChartOptions,
  ): ChartConfiguration<'doughnut'> {
    const styles = this.#chartStyleService.styles();

    // Build categories from series data
    const categories = options.series.data.map((d) => d.category);

    // Build datasets from series
    const dataset: ChartDataset<'doughnut'> = {
      label: options.series.labelText,
      data: options.series.data.map((dp) => dp.value),
    };

    // Build Plugin options
    const pluginOptions: ChartOptions<'doughnut'>['plugins'] = {
      sky_keyboard_nav: {
        valueLabel: (_datasetIndex, dataIndex) => {
          const series = options.series;
          const category = categories[dataIndex];
          const slice = series.data.find((d) => d.category === category);
          const label = slice?.labelText ?? '';
          return label;
        },
      },
      tooltip: {
        intersect: false,
        callbacks: {
          label(context) {
            const series = options.series;
            const category = categories[context.dataIndex];
            const slice = series.data.find((d) => d.category === category);
            const percent = percentOfVisibleDataset(context);
            return `${slice?.labelText} (${percent.toFixed(2)}%)`;
          },
        },
      },
    };

    // Build chart options
    const chartOptions: ChartOptions<'doughnut'> = {
      layout: {
        // Add some extra layout padding for the offset indicators
        padding: styles.chartPadding + 10,
      },
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'r',
      },
      datasets: {
        doughnut: {
          borderWidth: styles.charts.donut.borderWidth,
          borderColor: styles.charts.donut.borderColor,
        },
      },
      plugins: pluginOptions,
      onClick: (_, elements) => {
        if (elements.length === 0) {
          return;
        }

        const element = elements[0];
        const series = options.series;
        const dataPoint = series.data[element.index];

        if (dataPoint) {
          options.callbacks.onDatapointClick({
            series: series.labelText,
            category: dataPoint.category,
            value: dataPoint.value,
          });
        }
      },
    };

    const config = this.#globalConfig.getMergedChartConfiguration<'doughnut'>({
      type: 'doughnut',
      data: { labels: categories, datasets: [dataset] },
      options: chartOptions,
      plugins: [],
    });

    return config;
  }
}

function percentOfVisibleDataset(context: TooltipItem<'doughnut'>): number {
  const value = Number(context.raw) || 0;
  const chart = context.chart;

  // Total up the visible data points in the dataset
  const visibleTotal = context.dataset.data.reduce((sum, v, i) => {
    if (!chart.getDataVisibility(i)) {
      return sum;
    }

    return sum + (Number(v) || 0);
  }, 0);

  return visibleTotal ? (value / visibleTotal) * 100 : 0;
}

// #region Types
/** Configuration for the donut chart component. */
export interface SkyDonutChartOptions {
  /**
   * The data series for the chart.
   */
  series: SkyChartSeries<SkyDonutChartSlice>;

  callbacks: {
    onDatapointClick: (
      event: SkyChartActivatedDatapoint<SkyDonutDatum>,
    ) => void;
  };
}
// #endregion

import { Directive, Signal, computed, signal, viewChild } from '@angular/core';

import { Chart, ChartConfiguration } from 'chart.js';

import { SkyBaseChart } from './base-chart';
import { SkyChartLegendItem } from './chart-legend/chart-legend-item';
import { SkyChartJsDirective } from './chartjs.directive';
import { isDonutOrPieChart } from './shared/chart-helpers';

/**
 * Base class for Chart.js-based charts.
 * @internal
 */
@Directive()
export abstract class SkyChartJsChart extends SkyBaseChart {
  protected readonly chartDirective = viewChild.required(SkyChartJsDirective);
  protected readonly chart = computed(() => this.chartDirective()?.chart());

  protected abstract readonly chartConfiguration: Signal<
    ChartConfiguration | undefined
  >;

  readonly #refreshLegendItems = signal(0);
  protected readonly legendItems = computed(() => {
    const chart = this.chart();
    this.#refreshLegendItems();

    return this.#getLegendItems(chart);
  });

  protected onLegendItemToggled(item: SkyChartLegendItem): void {
    const chart = this.chart();

    if (!chart) return;

    if (isDonutOrPieChart(chart)) {
      chart.toggleDataVisibility(item.index);
    } else {
      const isVisible = chart.isDatasetVisible(item.datasetIndex);
      chart.setDatasetVisibility(item.datasetIndex, !isVisible);
    }

    chart.update();

    // Refetch the legend items to reflect the updated visibility state
    this.#refreshLegendItems.update((value) => value + 1);
  }

  #getLegendItems(chart: Chart | undefined): SkyChartLegendItem[] {
    if (!chart) {
      return [];
    }

    const labels = chart.options.plugins?.legend?.labels;
    const legendItems = labels?.generateLabels?.(chart) ?? [];

    const newLegendItems = legendItems.map((legendItem) => {
      const itemIndex = legendItem.index ?? 0;
      const datasetIndex = legendItem.datasetIndex ?? 0;
      const isVisible = isDonutOrPieChart(chart)
        ? chart.getDataVisibility(itemIndex)
        : chart.isDatasetVisible(datasetIndex);

      return {
        datasetIndex: datasetIndex,
        index: itemIndex,
        isVisible: isVisible,
        label: legendItem.text,
        seriesColor: String(legendItem.fillStyle ?? 'transparent'),
      };
    });

    return newLegendItems;
  }
}

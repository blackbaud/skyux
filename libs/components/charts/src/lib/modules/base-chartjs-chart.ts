import { Directive, computed, signal, viewChild } from '@angular/core';

import { Chart } from 'chart.js';

import { SkyBaseChart } from './base-chart';
import { SkyChartLegendItem } from './chart-legend/chart-legend-item';
import { SkyChartJsDirective } from './chartjs.directive';
import { isDonutOrPieChart } from './shared/chart-helpers';

/**
 * Base class for Chart.js-based charts.
 * @internal
 */
@Directive()
export abstract class SkyBaseChartJsChart extends SkyBaseChart {
  /**
   * Reference to the Chart.js directive that manages the canvas and Chart.js instance.
   */
  protected readonly chartDirective = viewChild.required(SkyChartJsDirective);

  /**
   * The Chart.js Chart instance, accessed through the directive.
   */
  protected readonly chart = computed(() => this.chartDirective()?.chart());

  /**
   * Signal used to trigger legend items recalculation.
   * Incremented when legend visibility changes.
   */
  readonly #refreshLegendItems = signal(0);

  /**
   * Computed signal that generates the legend items from the Chart.js chart.
   * Automatically updates when the chart changes or when legend visibility is toggled.
   */
  protected readonly legendItems = computed(() => {
    const chart = this.chart();
    this.#refreshLegendItems(); // Include refreshLegendItems to trigger recalculation when legend visibility changes

    return this.#getLegendItems(chart);
  });

  /**
   * Signal that tracks theme version to trigger configuration recalculation.
   * Incremented each time the theme changes.
   */
  protected readonly themeVersion = signal(0);

  /**
   * Called when the theme changes.
   * Increments the theme version to trigger chart configuration recalculation.
   */
  protected onThemeChanged(): void {
    this.themeVersion.update((v) => v + 1);
  }

  /**
   * Handles legend item toggle events.
   * Updates the chart's dataset visibility and refreshes the legend items.
   *
   * @param item The legend item that was toggled
   */
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

  /**
   * Generates legend items from the Chart.js chart's legend labels.
   *
   * @param chart The Chart.js chart instance
   * @returns Array of legend items with visibility state and styling information
   */
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

import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { SKY_CHART_AXIS_REGISTRY } from '../axis/sky-chart-axis-registry.service';
import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';
import { SkyChartService } from '../chart/chart.service';
import { SkyChartJsDirective } from '../chartjs.directive';
import { getLegendItems } from '../shared/chart-helpers';
import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';
import { SkyChartSeries } from '../shared/types/chart-series';
import { SkySelectedChartDataPoint } from '../shared/types/selected-chart-data-point';

import {
  SkyLineChartOptions,
  getChartJsLineChartConfig,
} from './line-chart-config';
import { SkyLineChartRegistry } from './line-chart-registery.service';
import { SkyLineChartPoint } from './line-chart-types';

@Component({
  selector: 'sky-line-chart',
  template: `
    @if (chartConfiguration(); as config) {
      <div class="chart-container" [style.height.px]="'300'">
        <canvas
          skyChartJs
          [chartConfiguration]="config"
          [ariaLabel]="arialLabel()"
          (themeChanged)="onThemeChanged()"
          (chartUpdated)="onChartUpdated()"
        ></canvas>
      </div>
    }
  `,
  // ChartJS requires the Canvas to have a parent container that is dedicated to the element
  // See: https://www.chartjs.org/docs/latest/configuration/responsive.html
  styles: '.chart-container { position: relative; }',
  imports: [SkyChartJsDirective],
  providers: [
    SkyLineChartRegistry,
    { provide: SKY_CHART_AXIS_REGISTRY, useClass: SkyLineChartRegistry },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartComponent {
  // #region Dependency Injection
  readonly #chartService = inject(SkyChartService);
  readonly #chartRegistry = inject(SkyLineChartRegistry);
  // #endregion

  // #region Inputs
  public readonly stacked = input(false, { transform: booleanAttribute });
  // #endregion

  // #region Outputs
  public readonly dataPointClicked = output<SkySelectedChartDataPoint>();
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  // #endregion

  protected readonly arialLabel = this.#chartService.headingText;
  readonly #chart = computed(() => this.chartDirective()?.chart());
  readonly #themeVersion = signal(0);
  readonly #chartUpdated = signal(0);
  readonly #refreshLegendItems = signal(0);
  readonly #chartOptions = signal<SkyLineChartOptions | undefined>(undefined);

  protected readonly chartConfiguration = computed(() => {
    // Track theme and chart configuration changes
    this.#themeVersion();
    const config = this.#chartOptions();

    if (!config) {
      return undefined;
    }

    return getChartJsLineChartConfig(config);
  });
  protected readonly legendItems = computed(() => {
    // Track chart, chart updates, series, and refresh triggers to update legend items
    const chart = this.#chart();
    this.#chartUpdated(); // We rely on ChartJS to track the visibility and color state
    const series = this.#chartService.series();
    this.#refreshLegendItems();

    return getLegendItems({
      chart: chart,
      legendMode: 'series',
      labels: series.map((s) => s.label),
    });
  });

  constructor() {
    // Sync series data to the chart service
    effect(() => {
      const config = this.#chartOptions();
      this.#chartService.setSeries(config?.series ?? []);
    });

    // Sync legend items to the chart service
    effect(() => {
      const items = this.legendItems();
      this.#chartService.setLegendItems(items);
    });

    // Handle legend toggle requests
    effect(() => {
      const item = this.#chartService.legendItemToggleRequested();
      if (item) {
        this.#onLegendItemToggled(item);
      }
    });

    // Whenever this chart-impacting input change (either in this component or its children), reparse the chart config
    effect(() => {
      const stacked = this.stacked();

      const categoryAxis = this.#chartRegistry.categoryAxis();
      const measureAxis = this.#chartRegistry.measureAxis();
      const series = this.#chartRegistry.series();

      const config = this.#parseConfigFromContent({
        stacked: stacked,
        categoryAxis: categoryAxis,
        measureAxis: measureAxis,
        series: series,
      });

      this.#chartOptions.set(config);
    });
  }

  /** Handle theme changes */
  protected onThemeChanged(): void {
    this.#themeVersion.update((v) => v + 1);
  }

  /** Handle chart updates */
  protected onChartUpdated(): void {
    this.#chartUpdated.update((v) => v + 1);
  }

  // #region Private
  #parseConfigFromContent(context: {
    stacked: boolean;
    categoryAxis: Readonly<SkyChartCategoryAxisConfig> | undefined;
    measureAxis: Readonly<SkyChartMeasureAxisConfig> | undefined;
    series: SkyChartSeries<SkyLineChartPoint>[];
  }): SkyLineChartOptions {
    const { stacked, categoryAxis, measureAxis, series } = context;

    return {
      stacked: stacked,
      series: series,
      categoryAxis: categoryAxis ? categoryAxis : undefined,
      measureAxis: measureAxis ? measureAxis : undefined,
      callbacks: {
        onDataPointClick: (dataPoint) => this.dataPointClicked.emit(dataPoint),
      },
    };
  }

  #onLegendItemToggled(item: SkyChartLegendItem): void {
    const chart = this.#chart();

    if (!chart) {
      return;
    }

    const isVisible = chart.isDatasetVisible(item.datasetIndex);
    chart.setDatasetVisibility(item.datasetIndex, !isVisible);
    chart.update();

    // Refetch the legend items to reflect the updated visibility state
    this.#refreshLegendItems.update((v) => v + 1);
  }
  // #endregion
}

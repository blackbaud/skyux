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
  SkyBarChartOptions,
  getChartJsBarChartConfig,
} from './bar-chart-config';
import { SkyBarChartRegistry } from './bar-chart-registery.service';
import { SkyBarChartPoint } from './bar-chart-types';

@Component({
  selector: 'sky-bar-chart',
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
    SkyBarChartRegistry,
    { provide: SKY_CHART_AXIS_REGISTRY, useClass: SkyBarChartRegistry },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBarChartComponent {
  // #region Dependency Injection
  readonly #chartService = inject(SkyChartService);
  readonly #chartRegistry = inject(SkyBarChartRegistry);
  // #endregion

  // #region Inputs
  public readonly orientation = input<'horizontal' | 'vertical'>('vertical');
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
  readonly #chartOptions = signal<SkyBarChartOptions | undefined>(undefined);

  protected readonly chartConfiguration = computed(() => {
    // Track theme and chart configuration changes
    this.#themeVersion();
    const config = this.#chartOptions();

    if (!config) {
      return undefined;
    }

    return getChartJsBarChartConfig(config);
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

    // Whenever chart-impacting input change recreate the chart config
    effect(() => {
      const orientation = this.orientation();
      const stacked = this.stacked();

      const categoryAxis = this.#chartRegistry.categoryAxis();
      const measureAxis = this.#chartRegistry.measureAxis();
      const series = this.#chartRegistry.series();

      const config = this.#parseConfigFromContent({
        orientation: orientation,
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
    orientation: 'horizontal' | 'vertical';
    stacked: boolean;
    categoryAxis: Readonly<SkyChartCategoryAxisConfig> | undefined;
    measureAxis: Readonly<SkyChartMeasureAxisConfig> | undefined;
    series: SkyChartSeries<SkyBarChartPoint>[];
  }): SkyBarChartOptions {
    const { orientation, stacked, categoryAxis, measureAxis, series } = context;

    return {
      orientation: orientation,
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

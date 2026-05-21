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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SKY_CHART_AXIS_REGISTRY } from '../axis/chart-axis-registry.service';
import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';
import { SkyChartService } from '../chart/chart.service';
import { SkyChartJsDirective } from '../chartjs/chartjs.directive';
import { buildChartSummary, getLegendItems } from '../shared/chart-helpers';
import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';
import type { SkyChartDataPointClickArgs } from '../shared/types/chart-data-point-click-args';
import { SkyChartSeries } from '../shared/types/chart-series';

import {
  SkyChartLineConfigService,
  SkyChartLineOptions,
} from './chart-line-config.service';
import { SkyChartLineRegistry } from './chart-line-registry.service';
import { SkyChartLineDatum, SkyChartLinePoint } from './chart-line-types';

/**
 * Displays a line chart visualization.
 */
@Component({
  selector: 'sky-chart-line',
  template: `
    @if (chartConfiguration(); as config) {
      <div class="chart-container" [style.height]="chartHeight()">
        <canvas
          skyChartJs
          [chartConfiguration]="config"
          [ariaLabel]="canvasAriaLabel()"
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
    SkyChartLineRegistry,
    { provide: SKY_CHART_AXIS_REGISTRY, useExisting: SkyChartLineRegistry },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartLineComponent {
  // #region Dependency Injection
  readonly #chartService = inject(SkyChartService);
  readonly #chartRegistry = inject(SkyChartLineRegistry);
  readonly #chartConfigService = inject(SkyChartLineConfigService);
  readonly #resources = inject(SkyLibResourcesService);
  // #endregion

  // #region Inputs
  public readonly dataPointsClickEnabled = input(false, {
    transform: booleanAttribute,
  });
  public readonly stacked = input(false, { transform: booleanAttribute });

  /**
   * A CSS height value (e.g. `'400px'`, `'20rem'`, `'50vh'`) for the chart.
   * When unspecified, the chart uses internal sizing logic.
   */
  public readonly height = input<string>();
  // #endregion

  // #region Outputs
  public readonly dataPointClick =
    output<SkyChartDataPointClickArgs<SkyChartLineDatum>>();
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  // #endregion

  readonly #chart = computed(() => this.chartDirective()?.chart());
  readonly #chartUpdated = signal(0);
  readonly #refreshLegendItems = signal(0);

  readonly #chartOptions = computed(() => {
    const dataPointsClickEnabled = this.dataPointsClickEnabled();
    const stacked = this.stacked();

    const categoryAxis = this.#chartRegistry.categoryAxis();
    const measureAxis = this.#chartRegistry.measureAxis();
    const series = this.#chartRegistry.series();

    const options = this.#parseOptions({
      dataPointsClickEnabled: dataPointsClickEnabled,
      stacked: stacked,
      categoryAxis: categoryAxis,
      measureAxis: measureAxis,
      series: series,
    });

    return options;
  });

  /** The height of the chart */
  protected readonly chartHeight = computed(() => {
    const explicitHeight = this.height();
    return explicitHeight ?? this.#chartConfigService.getChartHeight();
  });

  protected readonly canvasAriaLabel = toSignal(
    this.#resources.getString('chart.canvas.label.line'),
    { initialValue: '' },
  );

  protected readonly chartSummary = toSignal(
    toObservable(this.#chartOptions).pipe(
      switchMap((options) => (options ? this.#buildChartSummary(options) : '')),
    ),
    { initialValue: '' },
  );

  protected readonly chartConfiguration = computed(() => {
    const options = this.#chartOptions();

    if (!options) {
      return undefined;
    }

    return this.#chartConfigService.buildConfig(options);
  });

  readonly #legendItems = computed(() => {
    // Track chart, chart updates, series, and refresh triggers to update legend items
    const chart = this.#chart();
    this.#chartUpdated(); // Recalculate on ChartJs updates since we rely on it to track visibility and color state
    const series = this.#chartService.series();
    this.#refreshLegendItems();

    return getLegendItems({
      chart: chart,
      legendMode: 'series',
      labels: series.map((s) => s.labelText),
    });
  });

  constructor() {
    // Sync the generated chart summary to the chart service
    effect(() => {
      const summary = this.chartSummary();
      this.#chartService.generatedChartSummary.set(summary);
    });

    // Sync series data to the chart service
    effect(() => {
      const config = this.#chartOptions();
      this.#chartService.setSeries(config?.series ?? []);
    });

    // Sync legend items to the chart service
    effect(() => {
      const items = this.#legendItems();
      this.#chartService.setLegendItems(items);
    });

    // Handle legend toggle requests
    effect(() => {
      const item = this.#chartService.legendItemToggleRequested();
      if (item) {
        this.#onLegendItemToggled(item);
      }
    });
  }

  /** Handle chart updates */
  protected onChartUpdated(): void {
    this.#chartUpdated.update((v) => v + 1);
  }

  // #region Private
  #parseOptions(context: {
    dataPointsClickEnabled: boolean;
    stacked: boolean;
    categoryAxis: Readonly<SkyChartCategoryAxisConfig> | undefined;
    measureAxis: Readonly<SkyChartMeasureAxisConfig> | undefined;
    series: SkyChartSeries<SkyChartLinePoint>[];
  }): SkyChartLineOptions {
    const {
      dataPointsClickEnabled,
      stacked,
      categoryAxis,
      measureAxis,
      series,
    } = context;

    return {
      stacked: stacked,
      series: series,
      categoryAxis: categoryAxis ? categoryAxis : undefined,
      measureAxis: measureAxis ? measureAxis : undefined,
      dataPointsClickEnabled: dataPointsClickEnabled,
      callbacks: {
        onDataPointClick: (dataPoint) => this.dataPointClick.emit(dataPoint),
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

  #buildChartSummary(options: SkyChartLineOptions): Observable<string> {
    const chartTypeDescription$ = this.#resources.getString(
      'chart.summary.line_chart',
      options.series.length,
    );

    return buildChartSummary({
      headingText: this.#chartService.headingText(),
      subtitleText: this.#chartService.subtitleText(),
      chartTypeDescription$: chartTypeDescription$,
      categoryAxis: options.categoryAxis,
      measureAxis: options.measureAxis,
      resources: this.#resources,
    });
  }
  // #endregion
}

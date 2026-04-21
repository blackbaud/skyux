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

import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SKY_CHART_AXIS_REGISTRY } from '../axis/chart-axis-registry.service';
import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';
import { SkyChartService } from '../chart/chart.service';
import { SkyChartJsDirective } from '../chartjs/chartjs.directive';
import { getAxisLabelText, getLegendItems } from '../shared/chart-helpers';
import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';
import type { SkyChartDataPointClickArgs } from '../shared/types/chart-data-point-click-args';
import { SkyChartSeries } from '../shared/types/chart-series';

import {
  SkyChartBarConfigService,
  SkyChartBarOptions,
} from './chart-bar-config.service';
import { SkyChartBarRegistry } from './chart-bar-registry.service';
import {
  SkyChartBarDatum,
  SkyChartBarOrientation,
  SkyChartBarPoint,
} from './chart-bar-types';

/**
 * Displays a bar chart visualization.
 */
@Component({
  selector: 'sky-chart-bar',
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
    SkyChartBarRegistry,
    { provide: SKY_CHART_AXIS_REGISTRY, useExisting: SkyChartBarRegistry },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartBarComponent {
  // #region Dependency Injection
  readonly #chartService = inject(SkyChartService);
  readonly #chartRegistry = inject(SkyChartBarRegistry);
  readonly #chartConfigService = inject(SkyChartBarConfigService);
  readonly #resources = inject(SkyLibResourcesService);
  // #endregion

  // #region Inputs
  public readonly orientation = input<SkyChartBarOrientation>('vertical');
  public readonly stacked = input(false, { transform: booleanAttribute });
  public readonly dataPointsClickEnabled = input(false, {
    transform: booleanAttribute,
  });

  /**
   * A CSS height value (e.g. `'400px'`, `'20rem'`, `'50vh'`) for the chart.
   * When unspecified, the chart uses internal sizing logic.
   */
  public readonly height = input<string>();
  // #endregion

  // #region Outputs
  public readonly dataPointClick =
    output<SkyChartDataPointClickArgs<SkyChartBarDatum>>();
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  // #endregion

  readonly #chart = computed(() => this.chartDirective()?.chart());
  readonly #chartUpdated = signal(0);
  readonly #refreshLegendItems = signal(0);

  /** The height of the chart */
  protected readonly chartHeight = computed(() => {
    const explicitHeight = this.height();
    const options = this.#chartOptions();

    return explicitHeight ?? this.#chartConfigService.getChartHeight(options);
  });

  readonly #chartOptions = computed(() => {
    const dataPointsClickEnabled = this.dataPointsClickEnabled();
    const orientation = this.orientation();
    const stacked = this.stacked();

    const categoryAxis = this.#chartRegistry.categoryAxis();
    const measureAxis = this.#chartRegistry.measureAxis();
    const series = this.#chartRegistry.series();

    const options = this.#parseOptions({
      dataPointsClickEnabled: dataPointsClickEnabled,
      orientation: orientation,
      stacked: stacked,
      categoryAxis: categoryAxis,
      measureAxis: measureAxis,
      series: series,
    });

    return options;
  });

  protected readonly canvasAriaLabel = toSignal(
    this.#resources.getString('chart.canvas.label.bar'),
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

    // Sync series to the chart service
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
    orientation: SkyChartBarOrientation;
    stacked: boolean;
    categoryAxis: Readonly<SkyChartCategoryAxisConfig> | undefined;
    measureAxis: Readonly<SkyChartMeasureAxisConfig> | undefined;
    series: SkyChartSeries<SkyChartBarPoint>[];
  }): SkyChartBarOptions {
    const {
      dataPointsClickEnabled,
      orientation,
      stacked,
      categoryAxis,
      measureAxis,
      series,
    } = context;

    return {
      orientation: orientation,
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

  #buildChartSummary(options: SkyChartBarOptions): Observable<string> {
    const categoryAxisLabel = getAxisLabelText(options.categoryAxis);
    const measureAxisLabel = getAxisLabelText(options.measureAxis);

    const chartTypeDescription$ = this.#resources.getString(
      'chart.summary.bar_chart',
      options.series.length,
    );
    const categoryAxis$ = categoryAxisLabel
      ? this.#resources.getString(
          'chart.summary.category_axis',
          categoryAxisLabel,
        )
      : of('');
    const measureAxis$ = measureAxisLabel
      ? this.#resources.getString(
          'chart.summary.measure_axis',
          measureAxisLabel,
        )
      : of('');

    return combineLatest([
      chartTypeDescription$,
      categoryAxis$,
      measureAxis$,
    ]).pipe(
      map(([chartTypeDescription, categoryAxis, measureAxis]) => {
        const parts: string[] = [];

        const heading = this.#chartService.headingText();
        if (heading) {
          parts.push(heading);
        }

        parts.push(chartTypeDescription);

        const subtitle = this.#chartService.subtitleText();
        if (subtitle) {
          parts.push(subtitle);
        }

        if (categoryAxis) {
          parts.push(categoryAxis);
        }
        if (measureAxis) {
          parts.push(measureAxis);
        }
        return parts.join(' ');
      }),
    );
  }
  // #endregion
}

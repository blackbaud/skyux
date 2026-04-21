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

import type { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';
import { SkyChartService } from '../chart/chart.service';
import { SkyChartJsDirective } from '../chartjs/chartjs.directive';
import { getLegendItems } from '../shared/chart-helpers';
import type { SkyChartDataPointClickArgs } from '../shared/types/chart-data-point-click-args';
import { SkyChartSeries } from '../shared/types/chart-series';

import {
  SkyChartDonutConfigService,
  SkyChartDonutOptions,
} from './chart-donut-config.service';
import { SkyChartDonutRegistry } from './chart-donut-registry.service';
import { SkyChartDonutDatum, SkyChartDonutSlice } from './chart-donut-types';

/**
 * Displays a donut chart visualization.
 */
@Component({
  selector: 'sky-chart-donut',
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
  providers: [SkyChartDonutRegistry],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartDonutComponent {
  // #region Dependency Injection
  readonly #chartService = inject(SkyChartService);
  readonly #chartRegistry = inject(SkyChartDonutRegistry);
  readonly #chartConfigService = inject(SkyChartDonutConfigService);
  readonly #resources = inject(SkyLibResourcesService);
  // #endregion

  // #region Inputs
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
    output<SkyChartDataPointClickArgs<SkyChartDonutDatum>>();
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  // #endregion

  readonly #chart = computed(() => this.chartDirective()?.chart());
  readonly #chartUpdated = signal(0);
  readonly #refreshLegendItems = signal(0);

  readonly #chartOptions = computed(() => {
    const dataPointsClickEnabled = this.dataPointsClickEnabled();
    const series = this.#chartRegistry.series();
    const options = this.#parseOptions({
      dataPointsClickEnabled: dataPointsClickEnabled,
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
    this.#resources.getString('chart.canvas.label.donut'),
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

    const data = series[0]?.data ?? [];
    const categoryLabels = data.map((dp) => dp.category.toString());

    return getLegendItems({
      chart: chart,
      legendMode: 'category',
      labels: categoryLabels,
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
      const series = config?.series ? [config.series] : [];
      this.#chartService.setSeries(series);
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
    series: SkyChartSeries<SkyChartDonutSlice>[];
  }): SkyChartDonutOptions {
    const { dataPointsClickEnabled, series } = context;

    // Donut charts only supports a single series
    if (series.length > 1) {
      throw new Error('Donut charts only support a single series.');
    }

    return {
      series: series[0],
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

    chart.toggleDataVisibility(item.index);
    chart.update();

    // Refetch the legend items to reflect the updated visibility state
    this.#refreshLegendItems.update((v) => v + 1);
  }

  #buildChartSummary(options: SkyChartDonutOptions): Observable<string> {
    const chartTypeDescription$ = this.#resources.getString(
      'chart.summary.donut_chart',
      options.series.data.length,
    );

    return chartTypeDescription$.pipe(
      map((chartTypeDescription) => {
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

        return parts.join(' ');
      }),
    );
  }
  // #endregion
}

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
import type { SkyChartClickedDataPoint } from '../shared/types/chart-clicked-data-point';
import { SkyChartSeries } from '../shared/types/chart-series';

import {
  SkyBarChartConfigService,
  SkyBarChartOptions,
} from './bar-chart-config.service';
import { SkyBarChartRegistry } from './bar-chart-registry.service';
import {
  SkyBarChartOrientation,
  SkyBarChartPoint,
  SkyBarDatum,
} from './bar-chart-types';

/**
 * Displays a bar chart visualization.
 */
@Component({
  selector: 'sky-bar-chart',
  template: `
    @if (chartConfiguration(); as config) {
      <div class="chart-container" [style.height]="chartHeight()">
        <canvas
          skyChartJs
          [chartConfiguration]="config"
          [ariaLabel]="arialLabel()"
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
    { provide: SKY_CHART_AXIS_REGISTRY, useExisting: SkyBarChartRegistry },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBarChartComponent {
  // #region Dependency Injection
  readonly #chartService = inject(SkyChartService);
  readonly #chartRegistry = inject(SkyBarChartRegistry);
  readonly #chartConfigService = inject(SkyBarChartConfigService);
  // #endregion

  // #region Inputs
  public readonly orientation = input<SkyBarChartOrientation>('vertical');
  public readonly stacked = input(false, { transform: booleanAttribute });
  public readonly dataPointsClickable = input(false, {
    transform: booleanAttribute,
  });

  /**
   * A CSS height value (e.g. `'400px'`, `'20rem'`, `'50vh'`) for the chart.
   * When unspecified, the chart uses internal sizing logic.
   */
  public readonly height = input<string>();
  // #endregion

  // #region Outputs
  public readonly dataPointClicked =
    output<SkyChartClickedDataPoint<SkyBarDatum>>();
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  // #endregion

  protected readonly arialLabel = this.#chartService.headingText;
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
    const dataPointsClickable = this.dataPointsClickable();
    const orientation = this.orientation();
    const stacked = this.stacked();

    const categoryAxis = this.#chartRegistry.categoryAxis();
    const measureAxis = this.#chartRegistry.measureAxis();
    const series = this.#chartRegistry.series();

    const options = this.#parseOptions({
      dataPointsClickable: dataPointsClickable,
      orientation: orientation,
      stacked: stacked,
      categoryAxis: categoryAxis,
      measureAxis: measureAxis,
      series: series,
    });

    return options;
  });

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
    dataPointsClickable: boolean;
    orientation: SkyBarChartOrientation;
    stacked: boolean;
    categoryAxis: Readonly<SkyChartCategoryAxisConfig> | undefined;
    measureAxis: Readonly<SkyChartMeasureAxisConfig> | undefined;
    series: SkyChartSeries<SkyBarChartPoint>[];
  }): SkyBarChartOptions {
    const {
      dataPointsClickable,
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
      dataPointsClickable: dataPointsClickable,
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

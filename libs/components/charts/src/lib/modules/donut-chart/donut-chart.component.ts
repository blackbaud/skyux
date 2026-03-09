import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';
import { SkyChartService } from '../chart/chart.service';
import { SkyChartJsDirective } from '../chartjs.directive';
import { getLegendItems } from '../shared/chart-helpers';
import { SkyChartActivatedDatapoint } from '../shared/types/chart-activated-datapoint';
import { SkyChartSeries } from '../shared/types/chart-series';

import {
  SkyDonutChartConfigService,
  SkyDonutChartOptions,
} from './donut-chart-config.service';
import { SkyDonutChartRegistry } from './donut-chart-registry.service';
import { SkyDonutChartSlice } from './donut-chart-types';

/**
 * Displays a donut chart visualization.
 */
@Component({
  selector: 'sky-donut-chart',
  template: `
    @if (chartConfiguration(); as config) {
      <div class="chart-container" [style.height.px]="'300'">
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
  providers: [SkyDonutChartRegistry],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDonutChartComponent {
  // #region Dependency Injection
  readonly #chartService = inject(SkyChartService);
  readonly #chartRegistry = inject(SkyDonutChartRegistry);
  readonly #chartConfigService = inject(SkyDonutChartConfigService);
  // #endregion

  // #region Outputs
  public readonly datapointActivated = output<SkyChartActivatedDatapoint>();
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  // #endregion

  protected readonly arialLabel = this.#chartService.headingText;
  readonly #chart = computed(() => this.chartDirective()?.chart());
  readonly #chartUpdated = signal(0);
  readonly #refreshLegendItems = signal(0);

  readonly #chartOptions = computed(() => {
    const series = this.#chartRegistry.series();
    const options = this.#parseOptions({ series: series });

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

    const data = series[0]?.data ?? [];
    const categoryLabels = data.map((dp) => dp.category.toString());

    return getLegendItems({
      chart: chart,
      legendMode: 'category',
      labels: categoryLabels,
    });
  });

  constructor() {
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
    series: SkyChartSeries<SkyDonutChartSlice>[];
  }): SkyDonutChartOptions {
    const { series } = context;

    // Donut charts only supports a single series
    if (series.length > 1) {
      throw new Error('Donut charts only support a single series.');
    }

    return {
      series: series[0],
      callbacks: {
        onDatapointClick: (dataPoint) =>
          this.datapointActivated.emit(dataPoint),
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
  // #endregion
}

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  computed,
  contentChildren,
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
import { SkyChartSeries } from '../shared/types/chart-series';
import { SkySelectedChartDataPoint } from '../shared/types/selected-chart-data-point';

import {
  SkyDonutChartOptions,
  getChartJsDonutChartConfig,
} from './donut-chart-config';
import { SkyDonutChartSeriesComponent } from './donut-chart-series.component';
import { SkyDonutChartSlice } from './donut-chart-types';

@Component({
  selector: 'sky-donut-chart',
  template: `
    @if (chartConfiguration(); as config) {
      <div class="chart-container" [style.height.px]="'300'">
        <canvas
          skyChartJs
          [chartConfiguration]="config"
          [ariaLabel]="arialLabel()"
          (themeChanged)="onThemeChanged()"
        ></canvas>
      </div>
    }
  `,
  // ChartJS requires the Canvas to have a parent container that is dedicated to the element
  // See: https://www.chartjs.org/docs/latest/configuration/responsive.html
  styles: '.chart-container { position: relative; }',
  imports: [SkyChartJsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDonutChartComponent implements AfterContentInit {
  // #region Dependency Injection
  readonly #injector = inject(Injector);
  readonly #chartService = inject(SkyChartService);
  // #endregion

  // #region Inputs
  // #endregion

  // #region Outputs
  public readonly dataPointClicked = output<SkySelectedChartDataPoint>();
  // #endregion

  // #region Content Children
  /** The one to many series data for the chart  */
  protected readonly seriesComponents = contentChildren(
    SkyDonutChartSeriesComponent,
  );
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  protected readonly chart = computed(() => this.chartDirective()?.chart());
  // #endregion

  protected readonly arialLabel = this.#chartService.headingText;

  readonly #themeVersion = signal(0);
  readonly #refreshLegendItems = signal(0);

  readonly #donutConfig = signal<SkyDonutChartOptions | undefined>(undefined);
  protected readonly chartConfiguration = computed(() => {
    this.#themeVersion(); // Track theme version so recalculation triggers on theme change.
    const config = this.#donutConfig(); // Get the latest sky config, so recalculation triggers on content changes.

    if (!config) {
      return undefined;
    }

    const chartConfiguration = getChartJsDonutChartConfig(config);

    return chartConfiguration;
  });
  protected readonly legendItems = computed(() => {
    const chart = this.chart();
    const config = this.#donutConfig();
    this.#refreshLegendItems(); // Track to trigger recalculation when legend visibility changes.

    const categoryLabels =
      config?.series.data.map((dp) => dp.category.toString()) ?? [];

    return getLegendItems({
      chart: chart,
      legendMode: 'category',
      labels: categoryLabels,
    });
  });

  constructor() {
    // Sync series data to the chart service
    effect(() => {
      const config = this.#donutConfig();
      if (config) {
        this.#chartService.setSeries([config.series]);
      }
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
  }

  public ngAfterContentInit(): void {
    // Whenever the content children change, re-parse the chart config from the content
    effect(
      () => {
        const series = this.seriesComponents().map((component) =>
          component.series(),
        );

        const config = this.#parseConfigFromContent({
          series: series,
        });

        this.#donutConfig.set(config);
      },
      { injector: this.#injector },
    );
  }

  protected onThemeChanged(): void {
    this.#themeVersion.update((v) => v + 1);
  }

  // #region Private
  #parseConfigFromContent(context: {
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
        onDataPointClick: (dataPoint) => this.dataPointClicked.emit(dataPoint),
      },
    };
  }

  #onLegendItemToggled(item: SkyChartLegendItem): void {
    const chart = this.chart();

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

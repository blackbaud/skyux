import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { SkyChartCategoryAxisComponent } from '../axis/chart-category-axis.component';
import { SkyChartMeasureAxisComponent } from '../axis/chart-measure-axis.component';
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
import { SkyBarChartSeriesComponent } from './bar-chart-series.component';
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
export class SkyBarChartComponent implements AfterContentInit {
  // #region Dependency Injection
  readonly #injector = inject(Injector);
  readonly #chartService = inject(SkyChartService);
  // #endregion

  // #region Inputs
  public readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  public readonly stacked = input(false, { transform: booleanAttribute });
  // #endregion

  // #region Outputs
  public readonly dataPointClicked = output<SkySelectedChartDataPoint>();
  // #endregion

  // #region Content Children
  protected readonly categoryAxisComponent = contentChild(
    SkyChartCategoryAxisComponent,
  );
  protected readonly measureAxisComponent = contentChild(
    SkyChartMeasureAxisComponent,
  );
  /** The one to many series data for the chart  */
  protected readonly seriesComponents = contentChildren(
    SkyBarChartSeriesComponent,
  );
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  protected readonly chart = computed(() => this.chartDirective()?.chart());
  // #endregion

  protected readonly arialLabel = this.#chartService.headingText;

  readonly #themeVersion = signal(0);
  readonly #refreshLegendItems = signal(0);

  readonly #barChartConfig = signal<SkyBarChartOptions | undefined>(undefined);
  protected readonly chartConfiguration = computed(() => {
    this.#themeVersion(); // Track theme version so recalculation triggers on theme change.
    const config = this.#barChartConfig(); // Track chart config so recalculation triggers on content changes.

    if (!config) {
      return undefined;
    }

    return getChartJsBarChartConfig(config);
  });
  protected readonly legendItems = computed(() => {
    const chart = this.chart();
    const series = this.#chartService.series();
    this.#refreshLegendItems(); // Track to trigger recalculation when legend visibility changes.

    return getLegendItems({
      chart: chart,
      legendMode: 'series',
      labels: series.map((s) => s.label),
    });
  });

  constructor() {
    // Sync series data to the chart service
    effect(() => {
      const config = this.#barChartConfig();
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
  }

  public ngAfterContentInit(): void {
    // Whenever this chart-impacting input change (either in this component or its children), reparse the chart config
    effect(
      () => {
        const orientation = this.orientation();
        const stacked = this.stacked();
        const categoryAxis = this.categoryAxisComponent()?.axis();
        const measureAxis = this.measureAxisComponent()?.axis();
        const series = this.seriesComponents().map((component) =>
          component.series(),
        );

        const config = this.#parseConfigFromContent({
          orientation: orientation,
          stacked: stacked,
          categoryAxis: categoryAxis,
          measureAxis: measureAxis,
          series: series,
        });

        this.#barChartConfig.set(config);
      },
      { injector: this.#injector },
    );
  }

  protected onThemeChanged(): void {
    this.#themeVersion.update((v) => v + 1);
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
    const chart = this.chart();

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

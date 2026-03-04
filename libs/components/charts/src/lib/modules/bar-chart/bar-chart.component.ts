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
import { SkySelectedChartDataPoint } from '../shared/types/selected-chart-data-point';

import {
  SkyBarChartOptions,
  getChartJsBarChartConfig,
} from './bar-chart-config';
import { SkyBarChartSeriesComponent } from './bar-chart-series.component';

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
    const series = this.seriesComponents();
    this.#refreshLegendItems(); // Track to trigger recalculation when legend visibility changes.

    return getLegendItems({
      chart: chart,
      legendMode: 'series',
      labels: series.map((s) => s.labelText()),
    });
  });

  constructor() {
    // Sync series data to the chart service
    effect(() => {
      const config = this.#barChartConfig();
      this.#chartService.setSeries(config?.series ?? []);
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
        const categoryAxis = this.categoryAxisComponent();
        const measureAxis = this.measureAxisComponent();
        const series = this.seriesComponents();

        const config = this.#parseConfigFromContent({
          categoryAxisComponent: categoryAxis,
          measureAxisComponent: measureAxis,
          seriesComponents: series,
        });

        this.#barChartConfig.set(config);
      },
      { injector: this.#injector },
    );

    // Sync legend items to the chart service
    effect(
      () => {
        const items = this.legendItems();
        this.#chartService.setLegendItems(items);
      },
      { injector: this.#injector },
    );
  }

  protected onThemeChanged(): void {
    this.#themeVersion.update((v) => v + 1);
  }

  // #region Private
  #parseConfigFromContent(context: {
    categoryAxisComponent: Readonly<SkyChartCategoryAxisComponent> | undefined;
    measureAxisComponent: Readonly<SkyChartMeasureAxisComponent> | undefined;
    seriesComponents: readonly SkyBarChartSeriesComponent[];
  }): SkyBarChartOptions {
    const { categoryAxisComponent, measureAxisComponent, seriesComponents } =
      context;

    const categoryAxis = categoryAxisComponent;
    const measureAxis = measureAxisComponent;
    const series = seriesComponents.map((seriesComp) => seriesComp.series());

    return {
      orientation: this.orientation(),
      stacked: this.stacked(),
      series: series,
      categoryAxis: categoryAxis
        ? { label: categoryAxis.labelText() }
        : undefined,
      measureAxis: measureAxis
        ? {
            label: measureAxis.labelText(),
            scaleType: measureAxis.scaleType(),
            suggestedMin: measureAxis.suggestedMin(),
            suggestedMax: measureAxis.suggestedMax(),
          }
        : undefined,
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

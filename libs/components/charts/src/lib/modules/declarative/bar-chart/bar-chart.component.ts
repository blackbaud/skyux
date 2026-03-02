import {
  ChangeDetectionStrategy,
  Component,
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

import { Chart } from 'chart.js';

import { getChartJsBarChartConfig } from '../../bar-chart/bar-chart-config';
import {
  SkyBarChartConfig,
  SkyBarChartPoint,
} from '../../bar-chart/bar-chart-types';
import { SkyChartLegendItem } from '../../chart-legend/chart-legend-item';
import { SkyChartJsDirective } from '../../chartjs.directive';
import { SkyChartSeries } from '../../shared/types/chart-series';
import { SkySelectedChartDataPoint } from '../../shared/types/selected-chart-data-point';
import { SkyChartCategoryAxisComponent } from '../axis/chart-category-axis.component';
import { SkyChartMeasureAxisComponent } from '../axis/chart-measure-axis.component';
import { SkyChartComponent } from '../chart/chart.component';
import { SkyChartService } from '../chart/chart.service';

import { SkyBarChartSeriesComponent } from './bar-chart-series.component';

@Component({
  selector: 'sky-bar-chart-declarative',
  template: `
    @if (chartConfiguration(); as config) {
      <div class="chart-container" [style.height.px]="'300'">
        <canvas
          skyChartJs
          [chartConfiguration]="config"
          [ariaLabel]="headingText()"
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
export class SkyDeclarativeBarChartComponent {
  // #region Dependency Injection
  protected readonly chartComponent = inject(SkyChartComponent);
  protected readonly chartService = inject(SkyChartService);
  // #endregion

  // #region Inputs
  public readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  public readonly stacked = input(false, { transform: booleanAttribute });
  // #endregion

  // #region Outputs
  public readonly dataPointClicked = output<SkySelectedChartDataPoint>();
  // #endregion

  // #region Content Children
  protected readonly categoryAxisComponent = contentChild.required(
    SkyChartCategoryAxisComponent,
  );
  protected readonly measureAxisComponent = contentChild.required(
    SkyChartMeasureAxisComponent,
  );
  /** 1 to many series data for the chart  */
  protected readonly seriesComponents = contentChildren(
    SkyBarChartSeriesComponent,
  );
  // #endregion

  // #region View Children
  protected readonly chartDirective = viewChild(SkyChartJsDirective);
  protected readonly chart = computed(() => this.chartDirective()?.chart());
  // #endregion

  protected readonly headingText = computed(() =>
    this.chartComponent.headingText(),
  );

  readonly #themeVersion = signal(0);
  readonly #refreshLegendItems = signal(0);

  readonly #barChartConfig = computed<SkyBarChartConfig>(() => {
    const categoryAxis = this.categoryAxisComponent();
    const measureAxis = this.measureAxisComponent();

    const series: SkyChartSeries<SkyBarChartPoint>[] =
      this.seriesComponents().map((seriesComp) => ({
        label: seriesComp.labelText(),
        data: seriesComp.datapoints().map((dp) => ({
          category: dp.category(),
          label: dp.labelText(),
          value: dp.value(),
        })),
      }));

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
    };
  });
  protected readonly chartConfiguration = computed(() => {
    this.#themeVersion(); // Track theme version so recalculation triggers on theme change.
    const config = this.#barChartConfig(); // Get the latest sky config, so recalculation triggers on content changes.

    const chartConfiguration = getChartJsBarChartConfig(config, {
      onDataPointClick: (dataPoint) => this.dataPointClicked.emit(dataPoint),
    });

    return chartConfiguration;
  });
  protected readonly legendItems = computed(() => {
    const chart = this.chart();
    this.#refreshLegendItems(); // Track to trigger recalculation when legend visibility changes.
    return this.#getLegendItems(chart);
  });

  constructor() {
    // Sync series data to the chart service
    effect(() => {
      const config = this.#barChartConfig();
      this.chartService.setSeries(config.series);
    });

    // Sync legend items to the chart service
    effect(() => {
      const items = this.legendItems();
      this.chartService.setLegendItems(items);
    });

    // Handle legend toggle requests
    effect(() => {
      const item = this.chartService.legendItemToggleRequested();
      if (item) {
        this.#onLegendItemToggled(item);
      }
    });
  }

  protected onThemeChanged(): void {
    this.#themeVersion.update((v) => v + 1);
  }

  // #region Private
  #getLegendItems(chart: Chart | undefined): SkyChartLegendItem[] {
    if (!chart) {
      return [];
    }

    const labels = chart.options.plugins?.legend?.labels;
    const legendItems = labels?.generateLabels?.(chart) ?? [];

    return legendItems.map((legendItem) => ({
      datasetIndex: legendItem.datasetIndex ?? 0,
      index: legendItem.index ?? 0,
      isVisible: chart.isDatasetVisible(legendItem.datasetIndex ?? 0),
      label: legendItem.text,
      seriesColor: String(legendItem.fillStyle ?? 'transparent'),
    }));
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

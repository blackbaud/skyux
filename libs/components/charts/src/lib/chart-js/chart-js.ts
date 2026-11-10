import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartConfiguration,
  type ChartType,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  type Plugin,
  PointElement,
  Tooltip,
} from 'chart.js';

import { type SkyChartDataPointSeries } from '../chart-data-points/chart-data-point-series';
import { SkyChartDataPoints } from '../chart-data-points/chart-data-points';
import { type SkyChartJsDataPointIndex } from '../chart-js-plugins/chart-js-data-point-index';
import { measureDataPoints } from '../chart-js-plugins/data-point-geometry';
import { createDataPointPlugin } from '../chart-js-plugins/data-point-plugin';
import { SkyChartTableService } from '../chart-table/chart-table-service';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  Tooltip,
);

/**
 * A Chart.js configuration with a required `options` object. Plot components
 * always build a complete `options`, so requiring it here keeps the render
 * loop free of undefined checks.
 * @internal
 */
export type SkyChartJsConfig<TType extends ChartType = ChartType> =
  ChartConfiguration<TType> & {
    options: NonNullable<ChartConfiguration<TType>['options']>;
  };

/**
 * Renders a Chart.js chart onto a canvas and manages its lifecycle (create,
 * update, and destroy) from a reactive configuration. Plot components such as
 * `sky-chart-bar` build the configuration and delegate rendering here.
 * @internal
 */
@Component({
  imports: [SkyChartDataPoints],
  selector: 'sky-chart-js',
  styleUrl: './chart-js.scss',
  templateUrl: './chart-js.html',
})
export class SkyChartJs<TType extends ChartType = ChartType> {
  /**
   * The Chart.js configuration to render.
   */
  public readonly config = input.required<SkyChartJsConfig<TType>>();

  /**
   * Whether clicking a data point performs an action.
   */
  public readonly dataPointsClickable = input(false);

  /**
   * Fires when the user clicks a data point, or presses Enter or Space while a
   * data point has focus.
   */
  public readonly dataPointClick = output<SkyChartJsDataPointIndex>();

  protected readonly chartRef = viewChild.required('chartRef', {
    read: ElementRef,
  });

  protected readonly series = signal<SkyChartDataPointSeries[]>([]);

  protected readonly horizontal = computed(
    () => this.config().options.indexAxis === 'y',
  );

  protected readonly chartType = computed(() =>
    this.config().type === 'line' ? 'line' : 'bar',
  );

  readonly #tableSvc = inject(SkyChartTableService);

  readonly #dataPointPlugin = createDataPointPlugin({
    isClickable: () => this.dataPointsClickable(),
    onClick: (dataPoint) => this.dataPointClick.emit(dataPoint),
    onUpdate: (chart) =>
      this.series.set(
        measureDataPoints(chart, this.#tableSvc.table(), this.horizontal()),
      ),
  });

  #chart: Chart<TType> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.#chart?.destroy();
      this.#chart = undefined;
    });

    afterRenderEffect(() => {
      const config = this.config();

      // Data point labels come from the formatted data table, so re-render
      // when it changes.
      this.#tableSvc.table();

      if (this.#chart) {
        this.#chart.data = config.data;
        this.#chart.options = config.options;
        this.#chart.update();
      } else {
        this.#chart = new Chart<TType>(this.chartRef().nativeElement, {
          ...config,
          // The plugin handles any chart type; Chart.js's plugin type is
          // invariant in the chart type, so it must be narrowed here.
          plugins: [this.#dataPointPlugin.plugin as Plugin<TType>],
        });
      }
    });
  }

  protected onDataPointFocusChange(
    dataPoint: SkyChartJsDataPointIndex | undefined,
  ): void {
    this.#dataPointPlugin.setFocusedDataPoint(dataPoint);
  }

  protected onTooltipDismiss(): void {
    this.#dataPointPlugin.dismissTooltip();
  }
}

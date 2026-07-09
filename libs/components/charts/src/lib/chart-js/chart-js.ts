import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import Chart, { type ChartConfiguration, type ChartType } from 'chart.js/auto';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-js',
  // Chart.js detects size changes from the canvas's parent, not the canvas
  // itself, so the host must be a dedicated, relatively-positioned container
  // for the canvas. Without this, the chart fails to resize responsively and
  // can render blurry or continually shrink.
  // https://www.chartjs.org/docs/latest/configuration/responsive.html#important-note
  styles: `
    :host {
      display: block;
      position: relative;
    }
  `,
  template: `<canvas #chartRef aria-hidden="true"></canvas>`,
})
export class SkyChartJs<TType extends ChartType = ChartType> {
  /**
   * The Chart.js configuration to render.
   */
  public readonly config = input.required<SkyChartJsConfig<TType>>();

  protected readonly chartRef = viewChild.required('chartRef', {
    read: ElementRef,
  });

  #chart: Chart<TType> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.#chart?.destroy();
      this.#chart = undefined;
    });

    afterRenderEffect(() => {
      const config = this.config();

      if (this.#chart) {
        this.#chart.data = config.data;
        this.#chart.options = config.options;
        this.#chart.update();
      } else {
        this.#chart = new Chart<TType>(this.chartRef().nativeElement, config);
      }
    });
  }
}

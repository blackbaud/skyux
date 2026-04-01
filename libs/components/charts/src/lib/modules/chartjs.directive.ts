import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components globally
Chart.register(...registerables);

/**
 * Directive that renders a Chart.js chart on a canvas element and manages its lifecycle.
 * @internal
 */
@Directive({
  selector: 'canvas[skyChartJs]',
  host: {
    tabindex: '0',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    // Remove the default focus outline from the canvas element since we'll be implementing our own focus styles for keyboard navigation.
    '[style.outline]': '"none"',
  },
})
export class SkyChartJsDirective implements OnDestroy, AfterViewInit {
  // #region Dependency Injection
  readonly #element: ElementRef<HTMLCanvasElement> = inject(ElementRef);
  readonly #zone = inject(NgZone);
  // #endregion

  // #region Inputs
  /**
   * The Chart.js configuration object that defines the chart's data and options.
   */
  public readonly chartConfiguration = input.required<ChartConfiguration>();

  /**
   * The text used for the chart's ARIA label.
   */
  public readonly ariaLabel = input.required<string>();
  // #endregion

  // #region Outputs
  /**
   * An event emitted after the chart has been updated with new data or options.
   * @remarks This allows parent components to react to chart updates, such as by performing additional calculations or triggering change detection.
   */
  public readonly chartUpdated = output<void>();
  // #endregion

  readonly #canvasContext: CanvasRenderingContext2D;

  /**
   * Signal containing the Chart.js Chart instance.
   * This is undefined until the chart is created.
   */
  public readonly chart = signal<Chart | undefined>(undefined);

  constructor() {
    this.#canvasContext = this.#getCanvasContext();

    // Update the chart whenever the ChartJS configuration changes. This allows dynamic updates to the chart when inputs change.
    effect(() => {
      const newConfig = this.chartConfiguration();
      const chart = untracked(() => this.chart());

      if (chart) {
        // Update chart config options
        if (chart?.config.options && newConfig.options) {
          const newOptions = newConfig.options;
          Object.assign(chart.config.options, newOptions);
        }

        // Update chart data
        chart.data = newConfig.data;

        this.#updateChart();
      }
    });
  }

  /**
   * @inheritdoc
   */
  public ngOnDestroy(): void {
    this.#destroyChart();
  }

  /**
   * @inheritdoc
   */
  public ngAfterViewInit(): void {
    this.#renderChart();
  }

  #destroyChart(): void {
    this.chart()?.destroy();
    this.chart.set(undefined);
  }

  /**
   * Creates the initial Chart.js chart instance.
   * This is called once in `ngAfterViewInit` after the canvas element is ready.
   */
  #renderChart(): void {
    const config = this.chartConfiguration();

    this.#zone.runOutsideAngular(() => {
      this.chart.set(new Chart(this.#canvasContext, config));
    });
  }

  /**
   * Updates the chart by calling its `update()` method.
   * This should be called whenever the chart's data or options change to re-render the chart with the new configuration.
   */
  #updateChart(): void {
    if (this.chart()) {
      this.#zone.runOutsideAngular(() => this.chart()?.update());
      this.chartUpdated.emit();
    }
  }

  /**
   * Gets the 2D rendering context for the canvas element.
   * @throws Error if the canvas context cannot be created
   */
  #getCanvasContext(): CanvasRenderingContext2D {
    const canvasEle = this.#element.nativeElement;
    const canvasContext = canvasEle.getContext('2d');

    if (!canvasContext) {
      throw new Error('Cannot create chart without a canvas');
    }

    return canvasContext;
  }
}

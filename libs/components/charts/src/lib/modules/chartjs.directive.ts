import {
  AfterViewInit,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyThemeService } from '@skyux/theme';

import { Chart, ChartConfiguration } from 'chart.js';

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
  },
})
export class SkyChartJsDirective implements OnDestroy, AfterViewInit {
  // #region Dependency Injection
  readonly #element: ElementRef<HTMLCanvasElement> = inject(ElementRef);
  readonly #destroyRef = inject(DestroyRef);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #themeSvc = inject(SkyThemeService, { optional: true });
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
   * Emitted when the theme changes, indicating that the chart should regenerate its configuration to apply new theme values.
   */
  public readonly themeChanged = output<void>();
  // #endregion

  readonly #canvasContext: CanvasRenderingContext2D;

  /**
   * Signal containing the Chart.js Chart instance.
   * This is undefined until the chart is created.
   */
  public chart = signal<Chart | undefined>(undefined);

  constructor() {
    this.#canvasContext = this.#getCanvasContext();

    // Re-render the chart whenever the ChartJS configuration changes. This allows dynamic updates to the chart when inputs change.
    effect(() => {
      const config = this.chartConfiguration();
      const chart = this.chart();

      // Only update the chart if it already exists.
      // Initial creation is handled in ngAfterViewInit to ensure the canvas is ready.
      if (chart?.config.options && config.options) {
        // See https://www.chartjs.org/docs/latest/developers/updates.html#updating-options

        // 1. If the options are mutated in place, other option properties would be preserved, including those calculated by Chart.js.
        const newOptions = this.chartConfiguration().options;
        Object.assign(chart.config.options, newOptions);

        // 2. If created as a new object, it would be like creating a new chart with the options - old options would be discarded.
        // this.#chart.config.options = this.chartConfigProvider().options;

        this.#updateChart();
      }
    });
  }

  public ngOnDestroy(): void {
    this.chart()?.destroy();
    this.chart.set(undefined);
  }

  public ngAfterViewInit(): void {
    this.#renderChart();

    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => this.#onThemeChange());
    }
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
    if (this.chart) {
      this.#zone.runOutsideAngular(() => this.chart()?.update());
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

  /**
   * Handles theme changes from the SKY UX theme service.
   * Emits the `themeChanged` event to notify the parent component so it can
   * regenerate the chart configuration with updated theme values.
   */
  #onThemeChange(): void {
    this.themeChanged.emit();
    this.#changeDetector.markForCheck();
  }
}

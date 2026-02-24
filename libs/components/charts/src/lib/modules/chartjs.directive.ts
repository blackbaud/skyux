import {
  AfterViewInit,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyThemeService } from '@skyux/theme';

import { Chart, ChartConfiguration } from 'chart.js';

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

  readonly #canvasContext: CanvasRenderingContext2D;

  /** The ChartJS Chart instance */
  public chart = signal<Chart | undefined>(undefined);

  constructor() {
    this.#canvasContext = this.#getCanvasContext();
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

  #renderChart(): void {
    const config = this.chartConfiguration();

    this.#zone.runOutsideAngular(() => {
      this.chart.set(new Chart(this.#canvasContext, config));
    });
  }

  #updateChart(): void {
    if (this.chart) {
      this.#zone.runOutsideAngular(() => this.chart()?.update());
    }
  }

  #getCanvasContext(): CanvasRenderingContext2D {
    const canvasEle = this.#element.nativeElement;
    const canvasContext = canvasEle.getContext('2d');

    if (!canvasContext) {
      throw new Error('Cannot create chart without a canvas');
    }

    return canvasContext;
  }

  #onThemeChange(): void {
    const chart = this.chart();
    if (chart?.config.options) {
      // See https://www.chartjs.org/docs/latest/developers/updates.html#updating-options

      // 1. If the options are mutated in place, other option properties would be preserved, including those calculated by Chart.js.
      const newOptions = this.chartConfiguration().options;
      Object.assign(chart.config.options, newOptions);

      // 2. If created as a new object, it would be like creating a new chart with the options - old options would be discarded.
      // this.#chart.config.options = this.chartConfigProvider().options;

      this.#updateChart();
    }

    this.#changeDetector.markForCheck();
  }
}

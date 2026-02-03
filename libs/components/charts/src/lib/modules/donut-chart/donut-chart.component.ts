import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyThemeService } from '@skyux/theme';

import { Chart, ChartConfiguration, UpdateMode, registerables } from 'chart.js';

import { SkyChartDataGridComponent } from '../chart-data-grid/chart-data-grid.component';
import {
  SkyChartDataPointClickEvent,
  SkyDonutChartConfig,
} from '../shared/chart-types';
import { exportChartToPng } from '../shared/export-chart-to-png';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import { getChartJsDonutChartConfig } from './donut-chart-config';

// Register Chart.js components globally
Chart.register(...registerables);

@Component({
  selector: 'sky-donut-chart',
  templateUrl: 'donut-chart.component.html',
  styleUrl: 'donut-chart.component.scss',
  imports: [
    SkyChartsResourcesModule,
    SkyDropdownModule,
    SkyChartDataGridComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDonutChartComponent implements AfterViewInit, OnDestroy {
  // #region Dependency Injection
  readonly #destroyRef = inject(DestroyRef);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #themeSvc = inject(SkyThemeService, { optional: true });
  readonly #zone = inject(NgZone);
  // #endregion

  // #region Inputs
  public readonly headingText = input<string | undefined>();
  public readonly chartHeight = input.required<number>();

  /**
   * The ARIA label for the box. This sets the box's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  public readonly ariaLabel = input<string>();

  /**
   * Configuration for the bar chart. Defines categories, series data, orientation, and display options.
   */
  public readonly config = input.required<SkyDonutChartConfig>();
  // #endregion

  // #region Outputs
  public readonly dataPointClicked = output<SkyChartDataPointClickEvent>();
  // #endregion

  // #region View Child(ren)
  public readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  // #endregion

  protected readonly height = signal(300);
  protected readonly showDataGrid = signal(false);

  #chart: Chart<'doughnut'> | undefined;

  public ngAfterViewInit(): void {
    this.#renderChart();

    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => this.#onThemeChange());
    }
  }

  public ngOnDestroy(): void {
    this.#chart?.destroy();
    this.#chart = undefined;
  }

  protected onToggleDataGrid(): void {
    const current = this.showDataGrid();
    this.showDataGrid.set(!current);
  }

  protected exportToPng(): void {
    if (!this.#chart) {
      return;
    }

    exportChartToPng(this.#chart, this.canvasRef());
  }

  // #region Private
  #renderChart(): void {
    if (this.#chart) {
      this.#chart.destroy();
    }

    const canvasContext = this.#getCanvasContext();
    const config = this.#getChartConfig();

    this.#zone.runOutsideAngular(
      () => (this.#chart = new Chart(canvasContext, config)),
    );
  }

  #updateChart(mode?: UpdateMode): void {
    if (this.#chart) {
      this.#zone.runOutsideAngular(() => this.#chart?.update(mode));
    }
  }

  #getCanvasContext(): CanvasRenderingContext2D {
    const canvasEle = this.canvasRef().nativeElement;
    const canvasContext = canvasEle.getContext('2d');

    if (!canvasContext) {
      throw new Error('Cannot create chart without a canvas');
    }

    return canvasContext;
  }

  #getChartConfig(): ChartConfiguration<'doughnut'> {
    const userConfig = this.config();
    return getChartJsDonutChartConfig(userConfig, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });
  }

  #onThemeChange(): void {
    if (this.#chart?.config.options) {
      // See https://www.chartjs.org/docs/latest/developers/updates.html#updating-options

      // 1. If the options are mutated in place, other option properties would be preserved, including those calculated by Chart.js.
      const newOptions = this.#getChartConfig().options;
      Object.assign(this.#chart.config.options, newOptions);

      // 2. If created as a new object, it would be like creating a new chart with the options - old options would be discarded.
      // this.#chart.config.options = this.#getChartConfig().options;

      this.#updateChart();
    }

    this.#changeDetector.markForCheck();
  }
  // #endregion
}

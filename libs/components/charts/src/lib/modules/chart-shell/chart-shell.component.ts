import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  OnDestroy,
  booleanAttribute,
  computed,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyModalService } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyThemeService } from '@skyux/theme';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { SkyChartGridModalContext } from '../chart-data-grid-modal/chart-data-grid-modal-context';
import { SkyChartDataGridModalComponent } from '../chart-data-grid-modal/chart-data-grid-modal.component';
import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';
import { SkyChartLegendComponent } from '../chart-legend/chart-legend.component';
import { isDonutOrPieChart } from '../shared/chart-helpers';
import {
  SkyChartDataPoint,
  SkyChartDataPointClickEvent,
  SkyChartSeries,
} from '../shared/chart-types';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import {
  SKY_CHART_HEADER_ID,
  provideSkyChartHeaderId,
} from './chart-header-id-token';
import {
  SkyChartHeadingLevel,
  isSkyChartHeadingLevel,
} from './chart-heading-level';
import {
  SkyChartHeadingStyle,
  isSkyChartHeadingStyle,
} from './chart-heading-style';

// Register Chart.js components globally
Chart.register(...registerables);

/**
 * Shell component for all chart types. Handles common Chart.js lifecycle,
 * rendering, theme changes, and modal integration.
 */
@Component({
  selector: 'sky-chart-shell',
  templateUrl: './chart-shell.component.html',
  styleUrl: './chart-shell.component.scss',
  imports: [
    SkyChartsResourcesModule,
    SkyDropdownModule,
    SkyChartLegendComponent,
  ],
  providers: [provideSkyChartHeaderId()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartShellComponent implements AfterViewInit, OnDestroy {
  // #region Dependency Injection
  readonly #destroyRef = inject(DestroyRef);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #themeSvc = inject(SkyThemeService, { optional: true });
  readonly #zone = inject(NgZone);
  readonly #modalService = inject(SkyModalService);
  protected readonly headerId = inject(SKY_CHART_HEADER_ID);
  // #endregion

  // #region Inputs
  /**
   * The text to display as the chart's heading.
   */
  public readonly headingText = input.required<string>();

  /**
   * Indicates whether to hide the `headingText`.
   */
  public readonly headingHidden = input(false, { transform: booleanAttribute });

  /**
   * The semantic heading level in the document structure. The default is 3.
   * @default 3
   */
  public readonly headingLevel = input<SkyChartHeadingLevel, unknown>(3, {
    transform: (value: unknown) => {
      const numberValue = numberAttribute(value, 3);
      if (isSkyChartHeadingLevel(numberValue)) {
        return numberValue;
      }

      return 3;
    },
  });

  /**
   * The heading [font style](https://developer.blackbaud.com/skyux/design/styles/typography#headings).
   * @default 3
   */
  public readonly headingStyle = input<SkyChartHeadingStyle, unknown>(3, {
    transform: (value: unknown) => {
      const numberValue = numberAttribute(value, 3);
      if (isSkyChartHeadingStyle(numberValue)) {
        return numberValue;
      }

      return 3;
    },
  });

  /**
   * Indicates whether to hide the `headingText`.
   */
  public readonly subtitleHidden = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The text to display as the chart's subtitle.
   */
  public readonly subtitleText = input<string>();

  public readonly chartHeight = input.required<number>();
  public readonly ariaLabel = input<string>();

  public readonly chartConfiguration = input.required<ChartConfiguration>();
  public readonly series =
    input.required<SkyChartSeries<SkyChartDataPoint>[]>();
  // #endregion

  // #region Outputs
  public readonly refreshConfiguration = output<void>();
  public readonly dataPointClicked = output<SkyChartDataPointClickEvent>();
  // #endregion

  // #region View Child(ren)
  public readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  // #endregion

  protected headingClass = computed(
    () => `sky-font-heading-${this.headingLevel()}`,
  );
  protected readonly chart = signal<Chart | undefined>(undefined);
  protected readonly legendItems = signal<SkyChartLegendItem[]>([]);

  public ngAfterViewInit(): void {
    this.#renderChart();
    this.#updateLegendItems();

    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => this.#onThemeChange());
    }
  }

  public ngOnDestroy(): void {
    this.chart()?.destroy();
    this.chart.set(undefined);
  }

  protected onLegendItemToggled(item: SkyChartLegendItem): void {
    const chart = this.chart();

    if (!chart) {
      return;
    }

    if (isDonutOrPieChart(chart)) {
      chart.toggleDataVisibility(item.index);
    } else {
      const isVisible = chart.isDatasetVisible(item.datasetIndex);
      chart.setDatasetVisibility(item.datasetIndex, !isVisible);
    }

    chart.update();
    this.#updateLegendItems();
  }

  protected openChartDataGridModal(): void {
    const modalContext = new SkyChartGridModalContext({
      modalTitle: this.headingText(),
      series: this.series(),
    });

    this.#modalService.open(SkyChartDataGridModalComponent, {
      size: 'large',
      providers: [
        { provide: SkyChartGridModalContext, useValue: modalContext },
      ],
    });
  }

  // #region Private
  #renderChart(): void {
    this.chart()?.destroy();

    const canvasContext = this.#getCanvasContext();
    const config = this.chartConfiguration();

    let newChart: Chart | undefined;
    this.#zone.runOutsideAngular(() => {
      newChart = new Chart(canvasContext, config);
    });

    this.chart.set(newChart);
  }

  #updateChart(): void {
    if (this.chart()) {
      this.#zone.runOutsideAngular(() => this.chart()?.update());
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

  #updateLegendItems(): void {
    const chart = this.chart();
    if (!chart) {
      return;
    }

    const labels = chart.options.plugins?.legend?.labels;
    const legendItems = labels?.generateLabels?.(chart) ?? [];

    const newLegendItems = legendItems.map((legendItem) => {
      const itemIndex = legendItem.index ?? 0;
      const datasetIndex = legendItem.datasetIndex ?? 0;
      const isVisible = isDonutOrPieChart(chart)
        ? chart.getDataVisibility(itemIndex)
        : chart.isDatasetVisible(datasetIndex);

      return {
        datasetIndex: datasetIndex,
        index: itemIndex,
        isVisible: isVisible,
        label: legendItem.text,
        seriesColor: String(legendItem.fillStyle ?? 'transparent'),
      };
    });

    this.legendItems.set(newLegendItems);
  }
  // #endregion
}

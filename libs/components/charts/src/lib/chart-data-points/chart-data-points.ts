import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import { type SkyChartDataPoint } from './chart-data-point';
import { type SkyChartDataPointSeries } from './chart-data-point-series';
import {
  getAdjacentDataPoint,
  getAdjacentSeriesDataPoint,
  getVerticalDataPoint,
} from './data-point-navigation';

/**
 * Makes a chart's data points reachable by keyboard and assistive technology.
 * Canvas drawings cannot receive focus or be read by assistive technology, so
 * each data point is mirrored by a transparent, focusable element positioned
 * over it. Keyboard navigation and screen reader descriptions follow
 * Highcharts' accessibility module (see `data-point-navigation.ts`).
 *
 * The data points are a single tab stop that always starts on the first data
 * point. Visual feedback (the tooltip and focus ring) is drawn on the canvas
 * by the parent in response to `dataPointFocusChange`.
 * @internal
 */
@Component({
  imports: [SkyChartsResourcesModule],
  selector: 'sky-chart-data-points',
  styleUrl: './chart-data-points.scss',
  templateUrl: './chart-data-points.html',
})
export class SkyChartDataPoints {
  readonly #elementRef = inject(ElementRef);

  /**
   * The measured data points, grouped by series, in series order.
   */
  public readonly series = input.required<readonly SkyChartDataPointSeries[]>();

  /**
   * Whether the data points are exposed to assistive technology as buttons
   * because activating them performs an action.
   */
  public readonly clickable = input(false);

  /**
   * Whether the chart's categories run top to bottom. Like Highcharts, the
   * arrow key pairs swap so they follow the category axis.
   */
  public readonly horizontal = input(false);

  /**
   * The type of chart. Like Highcharts, the arrow keys that cross series move
   * to the nearest data point drawn above or below in any line chart series,
   * since lines cross each other, and to the adjacent series in a bar chart.
   */
  public readonly chartType = input.required<'bar' | 'line'>();

  /**
   * Fires when the user clicks a data point, or presses Enter or Space while a
   * data point has focus.
   */
  public readonly dataPointClick = output<SkyChartDataPoint>();

  /**
   * Fires with the data point that received focus, or `undefined` when a data
   * point loses focus.
   */
  public readonly dataPointFocusChange = output<
    SkyChartDataPoint | undefined
  >();

  readonly #dataPoints = computed(() =>
    this.series().flatMap((chartSeries) => chartSeries.dataPoints),
  );

  // Reset whenever focus leaves the data points, so re-entering always starts
  // at the first data point.
  readonly #focusedKey = signal<string | undefined>(undefined);

  protected readonly tabStopKey = computed(() => {
    const dataPoints = this.#dataPoints();
    const focusedKey = this.#focusedKey();

    return dataPoints.some((dataPoint) => dataPoint.key === focusedKey)
      ? focusedKey
      : dataPoints[0].key;
  });

  protected getSeriesSummaryKey(chartSeries: SkyChartDataPointSeries): string {
    const plurality = chartSeries.valueCount === 1 ? 'singular' : 'plural';

    return `skyux_charts.chart.${this.chartType()}.series_summary_${plurality}`;
  }

  protected onFocus(dataPoint: SkyChartDataPoint): void {
    this.#focusedKey.set(dataPoint.key);
    this.dataPointFocusChange.emit(dataPoint);
  }

  protected onBlur(event: FocusEvent): void {
    const host = this.#elementRef.nativeElement;

    // Moving between data points refocuses one immediately, so only report
    // the loss of focus when it leaves the data points.
    if (!host.contains(event.relatedTarget as Node | null)) {
      this.#focusedKey.set(undefined);
      this.dataPointFocusChange.emit(undefined);
    }
  }

  protected onKeydown(
    event: KeyboardEvent,
    dataPoint: SkyChartDataPoint,
  ): void {
    const dataPoints = this.#dataPoints();

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.dataPointClick.emit(dataPoint);

      return;
    }

    const [
      previousCategoryKey,
      nextCategoryKey,
      previousSeriesKey,
      nextSeriesKey,
    ] = this.horizontal()
      ? ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      : ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    const moveAcrossSeries =
      this.chartType() === 'line'
        ? getVerticalDataPoint
        : getAdjacentSeriesDataPoint;

    let target: SkyChartDataPoint | undefined;

    switch (event.key) {
      case previousCategoryKey:
      case nextCategoryKey:
        target = getAdjacentDataPoint(
          dataPoints,
          dataPoint,
          event.key === nextCategoryKey,
        );
        break;

      case previousSeriesKey:
      case nextSeriesKey:
        target = moveAcrossSeries(
          dataPoints,
          dataPoint,
          event.key === nextSeriesKey,
        );
        break;

      case 'PageUp':
      case 'PageDown':
        target = getAdjacentSeriesDataPoint(
          dataPoints,
          dataPoint,
          event.key === 'PageDown',
        );
        break;

      case 'Home':
        target = dataPoints[0];
        break;

      case 'End':
        target = dataPoints[dataPoints.length - 1];
        break;

      default:
        return;
    }

    event.preventDefault();

    if (target) {
      (
        this.#elementRef.nativeElement.querySelector(
          `[data-sky-chart-point="${target.key}"]`,
        ) as HTMLElement
      ).focus();
    }
  }
}

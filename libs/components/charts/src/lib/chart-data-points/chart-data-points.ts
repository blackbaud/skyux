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

import {
  getAdjacentDataPoint,
  getAdjacentSeriesDataPoint,
  getVerticalDataPoint,
} from './data-point-navigation';

/**
 * A data point drawn on the chart's canvas, measured so a focusable stand-in
 * can be positioned over it.
 * @internal
 */
export interface SkyChartDataPoint {
  /** The Chart.js dataset (series) index. */
  datasetIndex: number;
  /** The Chart.js data (category) index. */
  index: number;
  key: string;
  category: string;
  seriesLabelText: string;
  accessibleName: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** The point's position along the category axis, in pixels. */
  plotX: number;
  /** The point's position along the value axis, in pixels. */
  plotY: number;
}

/**
 * The data points of a single series, described to assistive technology as a
 * group when the chart has multiple series.
 * @internal
 */
export interface SkyChartDataPointSeries {
  datasetIndex: number;
  labelText: string;
  seriesCount: number;
  valueCount: number;
  dataPoints: SkyChartDataPoint[];
}

/**
 * How the arrow keys that cross series move focus.
 * - `adjacent-series` moves to the nearest data point in the next or previous
 *   series. Highcharts navigates bar series this way.
 * - `nearest-point` moves to the nearest data point drawn above or below, in
 *   any series. Highcharts navigates line series this way.
 * @internal
 */
export type SkyChartSeriesNavigation = 'adjacent-series' | 'nearest-point';

type SkyChartDataPointMove = (
  dataPoints: SkyChartDataPoint[],
  current: SkyChartDataPoint,
) => SkyChartDataPoint | undefined;

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
   * How the arrow keys that cross series move focus.
   * @default 'adjacent-series'
   */
  public readonly seriesNavigation =
    input<SkyChartSeriesNavigation>('adjacent-series');

  /**
   * The resource keys of the sentence describing each series. The message
   * receives the series label, the series number, the series count, and the
   * series' value count as its arguments.
   */
  public readonly seriesSummaryResourceKeys = input.required<{
    singular: string;
    plural: string;
  }>();

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

  protected onFocus(dataPoint: SkyChartDataPoint): void {
    this.#focusedKey.set(dataPoint.key);
    this.dataPointFocusChange.emit(dataPoint);
  }

  protected onBlur(event: FocusEvent): void {
    const host = this.#elementRef.nativeElement;

    if (!host.contains(event.relatedTarget as Node | null)) {
      this.#focusedKey.set(undefined);
    }

    this.dataPointFocusChange.emit(undefined);
  }

  protected onKeydown(
    event: KeyboardEvent,
    dataPoint: SkyChartDataPoint,
  ): void {
    const dataPoints = this.#dataPoints();

    // Match by key: the template's data point may predate a re-measurement.
    const current = dataPoints.find(
      (candidate) => candidate.key === dataPoint.key,
    ) as SkyChartDataPoint;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.dataPointClick.emit(current);

      return;
    }

    const move = this.#getMove(event.key);

    if (!move) {
      return;
    }

    event.preventDefault();

    const target = move(dataPoints, current);

    if (target) {
      this.#getDataPointElement(target).focus();
    }
  }

  /**
   * Resolves how a key moves focus between data points, or `undefined` when
   * the key does not navigate.
   */
  #getMove(key: string): SkyChartDataPointMove | undefined {
    const horizontal = this.horizontal();

    const categoryKeys = horizontal
      ? ['ArrowUp', 'ArrowDown']
      : ['ArrowLeft', 'ArrowRight'];

    const seriesKeys = horizontal
      ? ['ArrowLeft', 'ArrowRight']
      : ['ArrowUp', 'ArrowDown'];

    const next = key === 'ArrowRight' || key === 'ArrowDown';

    if (categoryKeys.includes(key)) {
      return (dataPoints, current) =>
        getAdjacentDataPoint(dataPoints, current, next);
    }

    if (seriesKeys.includes(key)) {
      const moveAcrossSeries =
        this.seriesNavigation() === 'nearest-point'
          ? getVerticalDataPoint
          : getAdjacentSeriesDataPoint;

      return (dataPoints, current) =>
        moveAcrossSeries(dataPoints, current, next);
    }

    const moves: Record<string, SkyChartDataPointMove> = {
      PageDown: (dataPoints, current) =>
        getAdjacentSeriesDataPoint(dataPoints, current, true),
      PageUp: (dataPoints, current) =>
        getAdjacentSeriesDataPoint(dataPoints, current, false),
      Home: (dataPoints) => dataPoints[0],
      End: (dataPoints) => dataPoints[dataPoints.length - 1],
    };

    return moves[key];
  }

  #getDataPointElement(dataPoint: SkyChartDataPoint): HTMLElement {
    return this.#elementRef.nativeElement.querySelector(
      `[data-sky-chart-point="${dataPoint.key}"]`,
    ) as HTMLElement;
  }
}

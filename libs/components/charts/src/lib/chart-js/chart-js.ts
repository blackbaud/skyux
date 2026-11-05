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
  type ActiveElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartConfiguration,
  type ChartEvent,
  type Element as ChartJsElement,
  type ChartType,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  Tooltip,
  type TooltipModel,
} from 'chart.js';

import { SkyChartTableService } from '../chart-table/chart-table-service';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import {
  getAdjacentDataPoint,
  getAdjacentSeriesDataPoint,
  getVerticalDataPoint,
} from './data-point-navigation';

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
 * Identifies a plotted data point by its Chart.js dataset (series) index and
 * its data (category) index.
 * @internal
 */
export interface SkyChartJsDataPointIndex {
  datasetIndex: number;
  index: number;
}

/**
 * A focusable stand-in for a data point drawn on the canvas, positioned over
 * the point.
 */
interface SkyChartJsDataPoint extends SkyChartJsDataPointIndex {
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
 */
interface SkyChartJsSeries {
  datasetIndex: number;
  labelText: string;
  seriesCount: number;
  valueCount: number;
  dataPoints: SkyChartJsDataPoint[];
}

type SkyChartJsRingState = 'hover' | 'active' | 'focus';

// Matches the gap between Highcharts' focus border and its data point.
const RING_MARGIN = 2;

/**
 * Renders a Chart.js chart onto a canvas and manages its lifecycle (create,
 * update, and destroy) from a reactive configuration. Plot components such as
 * `sky-chart-bar` build the configuration and delegate rendering here.
 *
 * Canvas drawings cannot receive focus or be read by assistive technology, so
 * each visible data point is mirrored by a transparent, focusable element
 * positioned over it. Keyboard navigation, focus, and screen reader
 * descriptions follow Highcharts' accessibility module (see
 * `data-point-navigation.ts`).
 * @internal
 */
@Component({
  imports: [SkyChartsResourcesModule],
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
   * Whether clicking a data point performs an action. Clickable data points
   * show a pointer cursor and are exposed to assistive technology as buttons.
   */
  public readonly dataPointsClickable = input(false);

  /**
   * The resource keys of the sentence describing each series to assistive
   * technology. The message receives the series label, the series number, the
   * series count, and the series' value count as its arguments.
   */
  public readonly seriesSummaryResourceKeys = input.required<{
    singular: string;
    plural: string;
  }>();

  /**
   * Fires when the user clicks a data point, or presses Enter or Space while a
   * data point has focus.
   */
  public readonly dataPointClick = output<SkyChartJsDataPointIndex>();

  protected readonly chartRef = viewChild.required('chartRef', {
    read: ElementRef,
  });

  protected readonly series = signal<SkyChartJsSeries[]>([]);

  readonly #dataPoints = computed(() =>
    this.series().flatMap((chartSeries) => chartSeries.dataPoints),
  );

  // The roving tab stop. Reset to the first data point whenever focus leaves
  // the chart, so re-entering always starts at the beginning.
  readonly #activeKey = signal<string | undefined>(undefined);

  protected readonly activeKey = computed(() => {
    const dataPoints = this.#dataPoints();
    const activeKey = this.#activeKey();

    return dataPoints.some((dataPoint) => dataPoint.key === activeKey)
      ? activeKey
      : dataPoints[0].key;
  });

  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #tableSvc = inject(SkyChartTableService);

  #chart: Chart<TType> | undefined;
  #focusedKey: string | undefined;
  #hoveredKey: string | undefined;
  #pressedKey: string | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.#chart?.destroy();
      this.#chart = undefined;
    });

    afterRenderEffect(() => {
      const config = this.config();
      const options = {
        ...config.options,
        onClick: (event: ChartEvent, _: unknown, chart: Chart): void =>
          this.#onCanvasClick(event, chart),
      };

      // Data point labels come from the formatted data table, so re-render
      // when it changes.
      this.#tableSvc.table();

      if (this.#chart) {
        this.#chart.data = config.data;
        this.#chart.options = options;
        this.#chart.update();
      } else {
        this.#chart = new Chart<TType>(this.chartRef().nativeElement, {
          ...config,
          options,
          plugins: [
            {
              id: 'skyDataPoints',
              // Fires after every layout, including resizes and series
              // toggles, so the focusable points always track their bars and
              // points.
              afterUpdate: (chart: Chart<TType>): void =>
                this.#updateSeries(chart),
              afterEvent: (
                chart: Chart<TType>,
                args: { event: ChartEvent; changed?: boolean },
              ): void => this.#onCanvasEvent(chart, args),
              // Rings are drawn on the canvas rather than on the stand-in
              // elements, which would sit above the canvas and cover the
              // tooltip. Backgrounds sit behind the data point; borders sit
              // above it but below the tooltip, which draws last.
              beforeDatasetsDraw: (chart: Chart<TType>): void =>
                this.#drawRings(chart, 'background'),
              afterDatasetsDraw: (chart: Chart<TType>): void =>
                this.#drawRings(chart, 'border'),
            },
          ],
        });
      }
    });
  }

  protected onCanvasPointerDown(): void {
    this.#pressedKey = this.#hoveredKey;
    this.#getRenderedChart().draw();
  }

  protected onCanvasPointerUp(): void {
    this.#pressedKey = undefined;
    this.#getRenderedChart().draw();
  }

  protected onDataPointFocus(dataPoint: SkyChartJsDataPoint): void {
    this.#focusedKey = dataPoint.key;
    this.#activeKey.set(dataPoint.key);
    this.#setActiveElements([dataPoint], {
      x: dataPoint.left + dataPoint.width / 2,
      y: dataPoint.top + dataPoint.height / 2,
    });
  }

  protected onDataPointBlur(event: FocusEvent): void {
    const container = this.#elementRef.nativeElement;

    this.#focusedKey = undefined;

    if (!container.contains(event.relatedTarget as Node | null)) {
      this.#activeKey.set(undefined);
    }

    this.#setActiveElements([]);
  }

  protected onDataPointKeydown(
    event: KeyboardEvent,
    dataPoint: SkyChartJsDataPoint,
  ): void {
    const dataPoints = this.#dataPoints();
    // Match by key: the template's data point may predate a recalculation.
    const current = dataPoints.find(
      (candidate) => candidate.key === dataPoint.key,
    ) as SkyChartJsDataPoint;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onDataPointClick(current);
      return;
    }

    const move = this.#getKeyboardMove(event.key);

    if (!move) {
      return;
    }

    event.preventDefault();

    const target = move(dataPoints, current);

    if (target) {
      this.#getDataPointElement(target).focus();
    }
  }

  protected onDataPointClick(dataPoint: SkyChartJsDataPointIndex): void {
    if (this.dataPointsClickable()) {
      this.dataPointClick.emit({
        datasetIndex: dataPoint.datasetIndex,
        index: dataPoint.index,
      });
    }
  }

  #onCanvasClick(event: ChartEvent, chart: Chart): void {
    const element = getElementAtEvent(event, chart);

    if (element) {
      this.onDataPointClick(element);
    }
  }

  #onCanvasEvent(
    chart: Chart<TType>,
    args: { event: ChartEvent; changed?: boolean },
  ): void {
    const element =
      args.event.type === 'mouseout'
        ? undefined
        : getElementAtEvent(args.event, chart as Chart);
    const hoveredKey = element && toKey(element);

    chart.canvas.style.cursor =
      hoveredKey && this.dataPointsClickable() ? 'pointer' : '';

    if (hoveredKey !== this.#hoveredKey) {
      this.#hoveredKey = hoveredKey;
      this.#pressedKey = undefined;
      // Asks Chart.js to redraw the rings for the new hover state.
      args.changed = true;
    }
  }

  /**
   * Resolves how a key moves focus between data points, or `undefined` when
   * the key does not navigate.
   */
  #getKeyboardMove(
    key: string,
  ):
    | ((
        dataPoints: SkyChartJsDataPoint[],
        current: SkyChartJsDataPoint,
      ) => SkyChartJsDataPoint | undefined)
    | undefined {
    // Like Highcharts, a horizontal chart swaps the arrow key pairs so they
    // follow the category axis.
    const horizontal = this.config().options.indexAxis === 'y';
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
      // Highcharts moves line series to the nearest point above or below, and
      // bar series to the adjacent series.
      const moveAcrossSeries =
        this.config().type === 'line'
          ? getVerticalDataPoint
          : getAdjacentSeriesDataPoint;

      return (dataPoints, current) =>
        moveAcrossSeries(dataPoints, current, next);
    }

    return {
      PageDown: (
        dataPoints: SkyChartJsDataPoint[],
        current: SkyChartJsDataPoint,
      ) => getAdjacentSeriesDataPoint(dataPoints, current, true),
      PageUp: (
        dataPoints: SkyChartJsDataPoint[],
        current: SkyChartJsDataPoint,
      ) => getAdjacentSeriesDataPoint(dataPoints, current, false),
      Home: (dataPoints: SkyChartJsDataPoint[]) => dataPoints[0],
      End: (dataPoints: SkyChartJsDataPoint[]) =>
        dataPoints[dataPoints.length - 1],
    }[key];
  }

  /**
   * Data points render only after the chart is created, and the tooltip plugin
   * is always registered, so data point handlers can rely on both.
   */
  #getRenderedChart(): Chart<TType> & { tooltip: TooltipModel<TType> } {
    return this.#chart as Chart<TType> & { tooltip: TooltipModel<TType> };
  }

  #getDataPointElement(dataPoint: SkyChartJsDataPoint): HTMLElement {
    return this.#elementRef.nativeElement.querySelector(
      `[data-sky-chart-point="${dataPoint.key}"]`,
    ) as HTMLElement;
  }

  #drawRings(chart: Chart<TType>, layer: 'background' | 'border'): void {
    // Later states take precedence, matching the legend buttons: pressed over
    // focused over hovered.
    const states = new Map<string | undefined, SkyChartJsRingState>([
      [this.#hoveredKey, 'hover'],
      [this.#focusedKey, 'focus'],
      [this.#pressedKey, 'active'],
    ]);

    // The canvas cannot read CSS variables, so the themed ring styles are
    // resolved from custom properties on the host.
    const style = getComputedStyle(this.#elementRef.nativeElement);
    const radius = parseFloat(
      style.getPropertyValue('--sky-chart-js-ring-radius'),
    );
    const { ctx } = chart;

    for (const dataPoint of this.#dataPoints()) {
      const state = states.get(dataPoint.key);

      if (!state) {
        continue;
      }

      const lineWidth = parseFloat(
        style.getPropertyValue(`--sky-chart-js-ring-${state}-border-width`),
      );

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(
        dataPoint.left - RING_MARGIN,
        dataPoint.top - RING_MARGIN,
        dataPoint.width + RING_MARGIN * 2,
        dataPoint.height + RING_MARGIN * 2,
        radius,
      );

      if (layer === 'background') {
        ctx.fillStyle = style.getPropertyValue(
          `--sky-chart-js-ring-${state}-background-color`,
        );
        ctx.fill();
      } else {
        ctx.strokeStyle = style.getPropertyValue(
          `--sky-chart-js-ring-${state}-border-color`,
        );
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  #setActiveElements(
    dataPoints: SkyChartJsDataPointIndex[],
    position = { x: 0, y: 0 },
  ): void {
    const chart = this.#getRenderedChart();
    const elements = dataPoints.map(({ datasetIndex, index }) => ({
      datasetIndex,
      index,
    }));

    chart.setActiveElements(elements);
    chart.tooltip.setActiveElements(elements, position);
    chart.update();
  }

  #updateSeries(chart: Chart<TType>): void {
    const table = this.#tableSvc.table();
    const horizontal = this.config().options.indexAxis === 'y';
    const seriesCount = chart.data.datasets.length;
    const series: SkyChartJsSeries[] = [];

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!chart.isDatasetVisible(datasetIndex)) {
        return;
      }

      const tableSeries = table?.series[datasetIndex];
      const seriesLabelText = tableSeries?.label ?? '';
      const dataPoints: SkyChartJsDataPoint[] = [];

      chart.getDatasetMeta(datasetIndex).data.forEach((element, index) => {
        // Gaps (null values) draw nothing, so there is nothing to focus.
        if (dataset.data[index] === null || dataset.data[index] === undefined) {
          return;
        }

        const category = String(table?.categories[index] ?? '');
        const { x, y, ...bounds } = getElementGeometry(element);

        dataPoints.push({
          datasetIndex,
          index,
          key: toKey({ datasetIndex, index }),
          category,
          seriesLabelText,
          // Highcharts' default point description: "category, value. Series."
          accessibleName: `${category}, ${tableSeries?.values[index] ?? ''}. ${seriesLabelText}.`,
          ...bounds,
          plotX: horizontal ? y : x,
          plotY: horizontal ? x : y,
        });
      });

      series.push({
        datasetIndex,
        labelText: seriesLabelText,
        seriesCount,
        valueCount: dataset.data.length,
        dataPoints,
      });
    });

    this.series.set(series);
  }
}

function toKey({ datasetIndex, index }: SkyChartJsDataPointIndex): string {
  return `${datasetIndex}-${index}`;
}

function getElementAtEvent(
  event: ChartEvent,
  chart: Chart,
): ActiveElement | undefined {
  // The configured interaction mode may match several points (for example,
  // every point at a line chart's category), but a click targets the single
  // point under the pointer. Chart.js accepts its own event objects here
  // despite the DOM event type.
  return chart.getElementsAtEventForMode(
    event as unknown as Event,
    'nearest',
    { intersect: true },
    true,
  )[0];
}

/**
 * Resolves the area a data point occupies on the canvas, and its anchor point:
 * the end of a bar or the center of a line point. Final property values are
 * used so the geometry matches where an animating element comes to rest.
 */
function getElementGeometry(element: ChartJsElement): {
  left: number;
  top: number;
  width: number;
  height: number;
  x: number;
  y: number;
} {
  if (element instanceof BarElement) {
    // Coordinates are only null for gaps, which are never focusable.
    const { x, y, base, horizontal, width, height } = element.getProps(
      ['x', 'y', 'base', 'horizontal', 'width', 'height'],
      true,
    ) as {
      x: number;
      y: number;
      base: number;
      horizontal: boolean;
      width: number;
      height: number;
    };

    return horizontal
      ? {
          left: Math.min(x, base),
          top: y - height / 2,
          width: Math.abs(x - base),
          height,
          x,
          y,
        }
      : {
          left: x - width / 2,
          top: Math.min(y, base),
          width,
          height: Math.abs(y - base),
          x,
          y,
        };
  }

  const point = element as PointElement;
  const { x, y } = point.getCenterPoint(true);
  const radius = point.options.hoverRadius;

  return {
    left: x - radius,
    top: y - radius,
    width: radius * 2,
    height: radius * 2,
    x,
    y,
  };
}

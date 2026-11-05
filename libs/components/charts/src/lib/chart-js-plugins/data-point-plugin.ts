import {
  type ActiveElement,
  type Chart,
  type ChartEvent,
  type CoreInteractionOptions,
  type Plugin,
  type TooltipModel,
} from 'chart.js';

import {
  getElementGeometry,
  type SkyChartJsDataPointIndex,
  toDataPointKey,
} from './data-point-geometry';

type SkyChartJsRingState = 'hover' | 'active' | 'focus';

const RING_MARGIN = 2;

/**
 * Controls the data point plugin of a single chart.
 * @internal
 */
export interface SkyChartJsDataPointPlugin {
  /**
   * The plugin to pass in the chart's `plugins` configuration. It must not be
   * registered globally with `Chart.register`, which would apply it to every
   * Chart.js chart in the consumer's application.
   */
  plugin: Plugin;

  /**
   * Shows the tooltip and focus ring for the data point that has keyboard
   * focus, or clears them when given `undefined`.
   */
  setFocusedDataPoint(dataPoint: SkyChartJsDataPointIndex | undefined): void;
}

/**
 * Creates a Chart.js plugin that adds SKY UX data point interactions to a
 * single chart. Chart.js has no notion of keyboard focus, and it draws hover
 * feedback only by restyling the element itself, so this plugin:
 *
 * - draws hover, pressed, and focus rings around data points, matching the
 *   legend buttons' interaction states, beneath the tooltip
 * - shows the same hover highlight and tooltip for the data point that has
 *   keyboard focus as for a hovered data point
 * - reports clicks on data points and shows a pointer cursor over clickable
 *   data points
 * - reports each layout so the data points can be re-measured
 *
 * The rings are drawn on the canvas rather than on HTML elements, which would
 * sit above the canvas and cover the tooltip. Their themed styles are read
 * from custom properties inherited by the canvas (see `data-point-rings.scss`).
 *
 * Callbacks are captured by this factory rather than passed as plugin options,
 * because Chart.js resolves functions in plugin options by calling them with
 * its own arguments.
 * @internal
 */
export function createDataPointPlugin(callbacks: {
  /** Whether clicking a data point performs an action. */
  isClickable: () => boolean;
  /** Called after every layout, including resizes and series toggles. */
  onUpdate: (chart: Chart) => void;
  /** Called when the user clicks a data point on the canvas. */
  onClick: (dataPoint: SkyChartJsDataPointIndex) => void;
}): SkyChartJsDataPointPlugin {
  let chart: Chart | undefined;
  // Chart.js clears `chart.canvas` before uninstalling plugins, so the canvas
  // is kept to remove the listeners.
  let canvas: HTMLCanvasElement | undefined;

  let hovered: SkyChartJsDataPointIndex | undefined;
  let pressed: SkyChartJsDataPointIndex | undefined;
  let focused: SkyChartJsDataPointIndex | undefined;

  // These listeners exist only while the plugin is installed on a chart.
  const onPointerDown = (): void => {
    pressed = hovered;
    (chart as Chart).draw();
  };

  const onPointerUp = (): void => {
    pressed = undefined;
    (chart as Chart).draw();
  };

  function drawRings(ringChart: Chart, layer: 'background' | 'border'): void {
    // Later states take precedence, matching the legend buttons: pressed over
    // focused over hovered.
    const rings = new Map<
      string,
      { dataPoint: SkyChartJsDataPointIndex; state: SkyChartJsRingState }
    >();

    for (const [dataPoint, state] of [
      [hovered, 'hover'],
      [focused, 'focus'],
      [pressed, 'active'],
    ] as const) {
      if (dataPoint) {
        rings.set(toDataPointKey(dataPoint), { dataPoint, state });
      }
    }

    // The canvas cannot read CSS variables, so the themed ring styles are
    // resolved from the custom properties the canvas inherits.
    const style = getComputedStyle(ringChart.canvas);

    const ringStyle = (name: string): string =>
      style.getPropertyValue(`--sky-chart-data-point-ring-${name}`);

    const { ctx } = ringChart;

    for (const { dataPoint, state } of rings.values()) {
      const element = ringChart.getDatasetMeta(dataPoint.datasetIndex).data[
        dataPoint.index
      ];

      // The data point may have been removed since it gained focus.
      if (!element) {
        continue;
      }

      const bounds = getElementGeometry(element);

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(
        bounds.left - RING_MARGIN,
        bounds.top - RING_MARGIN,
        bounds.width + RING_MARGIN * 2,
        bounds.height + RING_MARGIN * 2,

        parseFloat(ringStyle('radius')),
      );

      if (layer === 'background') {
        ctx.fillStyle = ringStyle(`${state}-background-color`);
        ctx.fill();
      } else {
        ctx.strokeStyle = ringStyle(`${state}-border-color`);
        ctx.lineWidth = parseFloat(ringStyle(`${state}-border-width`));
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function onEvent(
    eventChart: Chart,
    args: { event: ChartEvent; changed?: boolean },
  ): void {
    const element =
      args.event.type === 'mouseout'
        ? undefined
        : getElementAtEvent(args.event, eventChart);

    // Chart.js never replays click events after an update, so each click is
    // reported once.
    if (args.event.type === 'click') {
      if (element) {
        callbacks.onClick(element);
      }

      return;
    }

    eventChart.canvas.style.cursor =
      element && callbacks.isClickable() ? 'pointer' : '';

    const hoveredKey = hovered && toDataPointKey(hovered);

    if ((element && toDataPointKey(element)) !== hoveredKey) {
      hovered = element;
      pressed = undefined;

      // Asks Chart.js to redraw the rings for the new hover state.
      args.changed = true;
    }
  }

  return {
    plugin: {
      id: 'skyDataPoints',
      install(installedChart: Chart): void {
        chart = installedChart;
        canvas = installedChart.canvas;
        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointerup', onPointerUp);
      },
      uninstall(): void {
        const installedCanvas = canvas as HTMLCanvasElement;

        installedCanvas.removeEventListener('pointerdown', onPointerDown);
        installedCanvas.removeEventListener('pointerup', onPointerUp);

        chart = undefined;
        canvas = undefined;
      },
      afterUpdate: (updatedChart: Chart): void =>
        callbacks.onUpdate(updatedChart),
      afterEvent: onEvent,
      // Backgrounds sit behind the data point; borders sit above it but below
      // the tooltip, which Chart.js draws last.
      beforeDatasetsDraw: (drawnChart: Chart): void =>
        drawRings(drawnChart, 'background'),
      afterDatasetsDraw: (drawnChart: Chart): void =>
        drawRings(drawnChart, 'border'),
    },

    setFocusedDataPoint(dataPoint): void {
      // Focusable data points exist only after the chart's first layout, so
      // the plugin is always installed by the time focus changes.
      const focusedChart = chart as Chart;

      // The tooltip plugin is always registered (see chart-js.ts).
      const tooltip = focusedChart.tooltip as TooltipModel<'bar'>;

      focused = dataPoint;

      if (!dataPoint) {
        focusedChart.setActiveElements([]);
        tooltip.setActiveElements([], { x: 0, y: 0 });
        focusedChart.update();
        return;
      }

      const bounds = getElementGeometry(
        focusedChart.getDatasetMeta(dataPoint.datasetIndex).data[
          dataPoint.index
        ],
      );

      const position = {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      };

      const event = { native: null, ...position } as unknown as Event;
      const hover = focusedChart.options.hover as CoreInteractionOptions;

      focusedChart.setActiveElements(
        focusedChart.getElementsAtEventForMode(event, hover.mode, hover, true),
      );

      tooltip.setActiveElements(
        focusedChart.getElementsAtEventForMode(
          event,
          tooltip.options.mode,
          tooltip.options,
          true,
        ),
        position,
      );

      focusedChart.update();
    },
  };
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

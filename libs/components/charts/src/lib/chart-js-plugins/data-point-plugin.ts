import {
  ArcElement,
  BarElement,
  type Chart,
  type ChartEvent,
  type CoreInteractionOptions,
  type TooltipModel,
} from 'chart.js';

import { type SkyChartJsDataPointIndex } from './chart-js-data-point-index';
import { type SkyChartJsDataPointPlugin } from './chart-js-data-point-plugin';
import {
  getArcProps,
  getElementGeometry,
  toDataPointKey,
} from './data-point-geometry';

export const RING_MARGIN = 2;

const FULL_CIRCLE_TOLERANCE = 1e-9;

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
 * from custom properties inherited by the canvas (see `chart-js.scss`).
 *
 * Callbacks are captured by this factory rather than passed as plugin options,
 * because Chart.js resolves functions in plugin options by calling them with
 * its own arguments.
 * @internal
 */
export function createDataPointPlugin(callbacks: {
  /**
   * Whether clicking a data point performs an action.
   */
  isClickable: () => boolean;
  /**
   * Called after every layout, including resizes and series toggles.
   */
  onUpdate: (chart: Chart) => void;
  /**
   * Called when the user clicks a data point on the canvas.
   */
  onClick: (dataPoint: SkyChartJsDataPointIndex) => void;
}): SkyChartJsDataPointPlugin {
  let chart: Chart | undefined;
  let hovered: SkyChartJsDataPointIndex | undefined;
  let pressed: SkyChartJsDataPointIndex | undefined;
  let focused: SkyChartJsDataPointIndex | undefined;

  function drawRings(ringChart: Chart, layer: 'background' | 'border'): void {
    // Later states take precedence, matching the legend buttons: pressed over
    // focused over hovered.
    const rings = new Map<
      string,
      {
        dataPoint: SkyChartJsDataPointIndex;
        state: 'hover' | 'active' | 'focus';
      }
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

      ctx.save();
      ctx.beginPath();

      if (element instanceof ArcElement) {
        // A box would cut across neighboring slices, so a slice's ring follows
        // its outline instead.
        const { x, y, startAngle, endAngle, innerRadius, outerRadius } =
          getArcProps(element);

        const innerRingRadius = Math.max(innerRadius - RING_MARGIN, 0);
        // Chart.js can compute a lone slice's sweep a rounding error short of a
        // full turn, so the check allows for a tiny shortfall.
        const isFullCircle =
          endAngle - startAngle >= Math.PI * 2 - FULL_CIRCLE_TOLERANCE;

        ctx.arc(x, y, outerRadius + RING_MARGIN, startAngle, endAngle);

        // A lone slice's ring is two separate circles; joining them, as for a
        // partial slice, would stroke a seam across the ring.
        if (isFullCircle) {
          ctx.moveTo(
            x + Math.cos(endAngle) * innerRingRadius,
            y + Math.sin(endAngle) * innerRingRadius,
          );
        }

        ctx.arc(x, y, innerRingRadius, endAngle, startAngle, true);

        if (!isFullCircle) {
          ctx.closePath();
        }
      } else {
        const bounds = getElementGeometry(element);
        const width = bounds.width + RING_MARGIN * 2;

        ctx.roundRect(
          bounds.left - RING_MARGIN,
          bounds.top - RING_MARGIN,
          width,
          bounds.height + RING_MARGIN * 2,
          // Line points are circles, so their rings are circles too.
          element instanceof BarElement
            ? parseFloat(ringStyle('radius'))
            : width / 2,
        );
      }

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

  function hasValue(
    updatedChart: Chart,
    dataPoint: SkyChartJsDataPointIndex | undefined,
  ): dataPoint is SkyChartJsDataPointIndex {
    const value =
      dataPoint &&
      updatedChart.data.datasets[dataPoint.datasetIndex]?.data[dataPoint.index];

    return value !== null && value !== undefined;
  }

  // Chart.js replays the last pointer event after an update, which normally
  // clears a stale hover, but not once its active elements are cleared below,
  // so rings for data points without a value are cleared here. A focused data
  // point loses its focusable element too, but removing a focused element
  // does not reliably fire `blur`, so its tooltip is cleared as well.
  function clearStatesWithoutValue(updatedChart: Chart): void {
    if (!hasValue(updatedChart, hovered)) {
      hovered = undefined;
    }

    if (!hasValue(updatedChart, pressed)) {
      pressed = undefined;
    }

    if (!focused || hasValue(updatedChart, focused)) {
      return;
    }

    focused = undefined;
    // Chart.js reads the active elements after this hook, so the cleared
    // state is drawn by the update in progress.
    updatedChart.setActiveElements([]);
    (updatedChart.tooltip as TooltipModel<'bar'>).setActiveElements([], {
      x: 0,
      y: 0,
    });
  }

  // Presses only toggle the active ring, so they are handled before Chart.js
  // and then cancelled, which also skips Chart.js's hover and tooltip update.
  function onPress(pressChart: Chart, args: { event: ChartEvent }): boolean {
    // Checks the native type because Chart.js also reports touches as
    // `mousedown`.
    const nativeType = args.event.native?.type;

    if (nativeType !== 'pointerdown' && nativeType !== 'pointerup') {
      return true;
    }

    pressed = nativeType === 'pointerdown' ? hovered : undefined;
    pressChart.draw();

    return false;
  }

  function onEvent(
    eventChart: Chart,
    args: { event: ChartEvent; changed?: boolean },
  ): void {
    // The configured interaction mode may match several points (for example,
    // every point at a line chart's category), but the pointer targets the
    // single point under it. Chart.js accepts its own event objects here
    // despite the DOM event type.
    const element =
      args.event.type === 'mouseout'
        ? undefined
        : eventChart.getElementsAtEventForMode(
            args.event as unknown as Event,
            'nearest',
            { intersect: true },
            true,
          )[0];

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
      },
      afterUpdate(updatedChart: Chart): void {
        clearStatesWithoutValue(updatedChart);
        callbacks.onUpdate(updatedChart);
      },
      beforeEvent: onPress,
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

      const element = focusedChart.getDatasetMeta(dataPoint.datasetIndex).data[
        dataPoint.index
      ];
      const bounds = getElementGeometry(element);

      // The center of a large slice's bounding box can fall outside the slice,
      // so slices are hit-tested at their centroid.
      const position =
        element instanceof ArcElement
          ? { x: bounds.x, y: bounds.y }
          : {
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

    dismissTooltip(): void {
      // Dismissed only after a data point gains focus, so the plugin is
      // installed.
      const focusedChart = chart as Chart;

      (focusedChart.tooltip as TooltipModel<'bar'>).setActiveElements([], {
        x: 0,
        y: 0,
      });
      focusedChart.update();
    },
  };
}

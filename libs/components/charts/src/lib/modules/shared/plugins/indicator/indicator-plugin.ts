import type { ActiveElement, Chart, Plugin } from 'chart.js';

import { SkyChartStyleService } from '../../services/chart-style.service';
import { focusedElementsState } from '../plugin-state/focused-elements-state';

import { drawIndicatorFill, drawIndicatorStroke } from './indicator-draw';
import type { IndicatorStyles } from './indicator-types';

/**
 * Unified indicator plugin that draws hover, active, and focus indicator boxes around chart data elements.
 * Only the highest-priority state draws per frame (focus > active > hover), preventing visual stacking when multiple states are true simultaneously.
 */
export function createIndicatorPlugin(
  styleService: SkyChartStyleService,
): Plugin {
  // Track pressed (active) state per chart instance.
  const pressedElements = new WeakMap<Chart, ActiveElement[]>();

  // Store bound event listeners per chart for proper cleanup in afterDestroy.
  const chartListeners = new WeakMap<
    Chart,
    { canvas: HTMLCanvasElement; listeners: [string, EventListener][] }
  >();

  return {
    id: 'sky_indicator',

    afterInit(chart): void {
      const canvas = chart.canvas;
      const listeners: [string, EventListener][] = [];

      const addListener = (event: string, handler: EventListener): void => {
        canvas.addEventListener(event, handler);
        listeners.push([event, handler]);
      };

      // Pointer support: show active indicator while pointer is down on a data element.
      addListener('pointerdown', () => {
        const elements = chart.getActiveElements();

        if (elements.length) {
          pressedElements.set(chart, elements);
          chart.draw();
        }
      });

      // Clear pressed state when pointer up/leaves/cancels on the canvas.
      const clearPressed = (): void => {
        if (pressedElements.has(chart)) {
          pressedElements.delete(chart);
          chart.draw();
        }
      };
      addListener('pointerup', clearPressed);
      addListener('pointerleave', clearPressed);
      addListener('pointercancel', clearPressed);

      // Keyboard support: show active indicator while Space is held down.
      const spaceKey = ' ' as const;
      addListener('keydown', ((e: KeyboardEvent) => {
        if (e.key !== spaceKey || e.repeat) {
          return;
        }

        const elements = chart.getActiveElements();

        if (elements?.length) {
          pressedElements.set(chart, [...elements]);
          chart.draw();
        }
      }) as EventListener);

      addListener('keyup', ((e: KeyboardEvent) => {
        if (e.key !== spaceKey) {
          return;
        }

        clearPressed();
      }) as EventListener);

      // Also clear on blur in case the key is released after focus leaves.
      addListener('blur', clearPressed);

      chartListeners.set(chart, { canvas, listeners });
    },

    afterDestroy(chart): void {
      const entry = chartListeners.get(chart);

      if (entry) {
        for (const [event, handler] of entry.listeners) {
          entry.canvas.removeEventListener(event, handler);
        }
        chartListeners.delete(chart);
      }

      pressedElements.delete(chart);
    },

    // Draw background fill BEFORE datasets (above grid lines, below data elements).
    beforeDatasetsDraw(chart): void {
      const state = resolveIndicatorState(chart, pressedElements, styleService);

      if (state) {
        drawIndicatorFill(chart, state.elements, state.styles);
      }
    },

    // Draw border stroke AFTER datasets (on top of everything).
    afterDatasetsDraw(chart): void {
      const state = resolveIndicatorState(chart, pressedElements, styleService);

      if (state) {
        drawIndicatorStroke(chart, state.elements, state.styles);
      }
    },
  };
}

interface IndicatorState {
  elements: ActiveElement[];
  styles: IndicatorStyles;
}

/**
 * Resolves which indicator state to draw based on priority: focus > active > hover.
 * Only the highest-priority state draws per frame, preventing visual stacking.
 */
function resolveIndicatorState(
  chart: Chart,
  pressedElements: WeakMap<Chart, ActiveElement[]>,
  styleService: SkyChartStyleService,
): IndicatorState | undefined {
  const indicatorStyles = styleService.styles().indicator;

  // Focus takes highest priority (keyboard navigation).
  const focused = focusedElementsState.get(chart);
  if (focused?.length) {
    return {
      elements: focused,
      styles: {
        padding: indicatorStyles.padding,
        borderRadius: indicatorStyles.borderRadius,
        borderWidth: indicatorStyles.focus.borderWidth,
        borderColor: indicatorStyles.focus.borderColor,
        backgroundColor: indicatorStyles.focus.backgroundColor,
      },
    };
  }

  // Active takes second priority (pointer down / Space held).
  const pressed = pressedElements.get(chart);
  if (pressed?.length) {
    return {
      elements: pressed,
      styles: {
        padding: indicatorStyles.padding,
        borderRadius: indicatorStyles.borderRadius,
        borderWidth: indicatorStyles.active.borderWidth,
        borderColor: indicatorStyles.active.borderColor,
        backgroundColor: indicatorStyles.active.backgroundColor,
      },
    };
  }

  // Hover is the baseline.
  const hovered = chart.getActiveElements();
  if (hovered?.length) {
    return {
      elements: hovered,
      styles: {
        padding: indicatorStyles.padding,
        borderRadius: indicatorStyles.borderRadius,
        borderWidth: indicatorStyles.hover.borderWidth,
        borderColor: indicatorStyles.hover.borderColor,
        backgroundColor: indicatorStyles.hover.backgroundColor,
      },
    };
  }

  return undefined;
}

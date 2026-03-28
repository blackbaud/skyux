import type { ActiveElement, Chart, Plugin } from 'chart.js';

import { SkyChartStyleService } from '../../services/chart-style.service';
import { focusedElementsState } from '../plugin-state/focused-elements-state';

import { drawIndicatorFill, drawIndicatorStroke } from './indicator-draw';
import type { IndicatorStyles } from './indicator-types';

/**
 * Indicator plugin that draws hover, active, and focus visual states around chart data elements.
 *
 * All applicable states draw each frame so multiple indicators can be visible simultaneously.
 * This supports the keyboard navigation plugin's WAI-ARIA model where hover and focus are independent.
 *
 * ### Visual States (drawn in z-order, last wins on overlap)
 * 1. **Hover** — Pointer-driven; drawn when the mouse is over a data element.
 * 2. **Active** — Drawn while the pointer is down on a data element, or while Space is held
 *    during keyboard navigation (targets the focused element when navigating, otherwise the hovered element).
 * 3. **Focus** — Keyboard-driven; drawn for the element tracked by the keyboard navigation plugin.
 *    Persists independently of hover and is cleared only by explicit user action (click, Tab, Escape).
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
      // Prefer the keyboard-focused element when navigating; fall back to hover.
      const spaceKey = ' ' as const;
      addListener('keydown', ((e: KeyboardEvent) => {
        if (e.key !== spaceKey || e.repeat) {
          return;
        }

        const focused = focusedElementsState.get(chart);
        const elements = focused?.length ? focused : chart.getActiveElements();

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

    // Draw background fills BEFORE datasets (above grid lines, below data elements).
    beforeDatasetsDraw(chart): void {
      const states = resolveIndicatorStates(
        chart,
        pressedElements,
        styleService,
      );

      for (const state of states) {
        drawIndicatorFill(chart, state.elements, state.styles);
      }
    },

    // Draw border strokes AFTER datasets (on top of everything).
    afterDatasetsDraw(chart): void {
      const states = resolveIndicatorStates(
        chart,
        pressedElements,
        styleService,
      );

      for (const state of states) {
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
 * Collects all indicator states that should draw this frame.
 * States are returned in visual z-order (hover first, focus last)
 * so the last-drawn state takes visual precedence on overlapping elements.
 */
function resolveIndicatorStates(
  chart: Chart,
  pressedElements: WeakMap<Chart, ActiveElement[]>,
  styleService: SkyChartStyleService,
): IndicatorState[] {
  const indicatorStyles = styleService.styles().indicator;
  const states: IndicatorState[] = [];

  // Hover is the baseline (drawn first, lowest visual precedence).
  const hovered = chart.getActiveElements();
  if (hovered?.length) {
    states.push({
      elements: hovered,
      styles: {
        padding: indicatorStyles.padding,
        borderRadius: indicatorStyles.borderRadius,
        borderWidth: indicatorStyles.hover.borderWidth,
        borderColor: indicatorStyles.hover.borderColor,
        backgroundColor: indicatorStyles.hover.backgroundColor,
      },
    });
  }

  // Active overlays hover (pointer down / Space held).
  const pressed = pressedElements.get(chart);
  if (pressed?.length) {
    states.push({
      elements: pressed,
      styles: {
        padding: indicatorStyles.padding,
        borderRadius: indicatorStyles.borderRadius,
        borderWidth: indicatorStyles.active.borderWidth,
        borderColor: indicatorStyles.active.borderColor,
        backgroundColor: indicatorStyles.active.backgroundColor,
      },
    });
  }

  // Focus draws last (highest visual precedence, keyboard-owned).
  const focused = focusedElementsState.get(chart);
  if (focused?.length) {
    states.push({
      elements: focused,
      styles: {
        padding: indicatorStyles.padding,
        borderRadius: indicatorStyles.borderRadius,
        borderWidth: indicatorStyles.focus.borderWidth,
        borderColor: indicatorStyles.focus.borderColor,
        backgroundColor: indicatorStyles.focus.backgroundColor,
      },
    });
  }

  return states;
}

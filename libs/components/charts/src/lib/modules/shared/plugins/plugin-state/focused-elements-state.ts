import { ActiveElement, Chart } from 'chart.js';

/**
 * Shared state between the keyboard navigation plugin and the focus indicator plugin.
 * The keyboard nav plugin writes focused elements here; the focus indicator plugin reads them to draw.
 */
export const focusedElementsState = new WeakMap<Chart, ActiveElement[]>();

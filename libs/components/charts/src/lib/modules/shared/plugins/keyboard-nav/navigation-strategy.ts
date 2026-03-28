import type { ActiveElement, Chart } from 'chart.js';

/**
 * Represents the currently focused data point in the chart, identified by its dataset index and data index.
 */
export interface FocusedElement {
  datasetIndex: number;
  index: number;
}

/**
 * Strategy interface for chart-type-specific keyboard navigation behavior.
 * Implementations handle arrow key movement and tooltip element selection
 * based on the chart's layout (cartesian vs. radial).
 */
export interface NavigationStrategy {
  /**
   * Computes the next focused element after an arrow key press.
   */
  navigate(key: string, current: FocusedElement): FocusedElement;

  /**
   * Returns the active elements that should be shown in the tooltip for the given focused element.
   */
  getTooltipElements(chart: Chart, focused: FocusedElement): ActiveElement[];
}

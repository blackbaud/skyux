import type { ActiveElement, Chart } from 'chart.js';

/**
 * Represents the currently focused data point in the chart, identified by its dataset index and data index.
 */
export interface FocusedElement {
  datasetIndex: number;
  index: number;
}

/**
 * Structured description of a focused chart element for screen reader announcements.
 */
export interface ElementDescription {
  /** The series label */
  seriesLabel: string;
  /** The human readable series index */
  seriesIndex: number;
  /** The total number of series in the chart */
  totalSeries: number;
  /** The category label */
  categoryLabel: string;
  /** The value of the data point */
  value: string;
  /** The human readable data point index */
  index: number;
  /** The total number of data points in the series */
  total: number;
}

/**
 * Strategy interface for chart-type-specific keyboard navigation behavior.
 */
export interface NavigationStrategy {
  /** Computes the next focused element after an arrow key press. */
  navigate(key: string, current: FocusedElement): FocusedElement;

  /** Returns the active elements that should be shown in the tooltip for the given focused element. */
  getTooltipElements(chart: Chart, focused: FocusedElement): ActiveElement[];

  /** Returns the structured description parts for a focused element. */
  describeElement(chart: Chart, focused: FocusedElement): ElementDescription;
}

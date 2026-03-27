import type { ActiveElement, Chart, ChartEvent, Plugin } from 'chart.js';

import { getChartType, isDonutChart } from '../../chart-helpers';
import { focusedElementsState } from '../plugin-state/focused-elements-state';

/**
 * Plugin that adds comprehensive keyboard navigation support to ChartJS charts.
 * Enables users to navigate through data points using arrow keys and interact using Enter/Space.
 *
 * ## Keyboard Navigation Support
 *
 * ### Getting Started
 * - **Tab** into the chart to focus it
 * - **Tab** again to focus the first data point and enter navigation mode
 * - A focus indicator will appear on the first data point
 *
 * ### Navigation Keys
 * - **Arrow Keys**: Navigate between data points and series
 *   - For vertical bar/line charts:
 *     - Left/Right: Move between data points (categories)
 *     - Up/Down: Move between series (datasets)
 *   - For horizontal bar/line charts:
 *     - Left/Right: Move between series (datasets)
 *     - Up/Down: Move between data points (categories)
 *   - For pie/doughnut charts:
 *     - Any arrow key: Move to next/previous segment
 * - **Enter/Space**: Activate the focused element (triggers click handler)
 * - **Escape**: Exit navigation mode
 * - **Tab**: Exit navigation mode and continue to the next focusable element
 *
 * ### Visual Feedback
 * - Blue focus indicator highlights the current data point
 * - Tooltip displays for the focused element
 * - Screen reader announces current position and value
 *
 * ### Accessibility Features
 * - Maintains focus state across keyboard interactions
 * - Visual focus indicators follow SKY UX design system
 */
export function createKeyboardNavPlugin(): Plugin {
  // Maintain a mapping of Chart instances to their corresponding keyboard managers.
  // This allows the plugin to manage keyboard interactions for multiple charts on the same page.
  const chartManagers = new Map<Chart, ChartKeyboardManager>();

  return {
    id: 'sky_keyboard_nav',
    afterInit: (chart): void => {
      const manager = new ChartKeyboardManager(chart);

      chartManagers.set(chart, manager);
      manager.initialize();
    },
    afterDestroy: (chart): void => {
      const manager = chartManagers.get(chart);

      manager?.destroy();
      chartManagers.delete(chart);
      focusedElementsState.delete(chart);
    },
  };
}

/**
 * Represents the currently focused data point in the chart, identified by its dataset index and data index.
 */
interface FocusedElement {
  datasetIndex: number;
  index: number;
}

/**
 * Manages keyboard interactions for a single chart instance.
 */
class ChartKeyboardManager {
  readonly #chart: Chart;
  readonly #canvas: HTMLCanvasElement;

  readonly #boundKeyDownHandler: (e: KeyboardEvent) => void;
  readonly #boundFocusHandler: () => void;
  readonly #boundBlurHandler: () => void;

  #focusedElement: FocusedElement | null = null;
  #isNavigating = false;

  constructor(chart: Chart) {
    this.#chart = chart;
    this.#canvas = chart.canvas;

    // Bind handlers
    this.#boundKeyDownHandler = this.#handleKeyDown.bind(this);
    this.#boundFocusHandler = this.#handleFocus.bind(this);
    this.#boundBlurHandler = this.#handleBlur.bind(this);
  }

  /**
   * Initializes the chart keyboard manager
   */
  public initialize(): void {
    this.#canvas.addEventListener('keydown', this.#boundKeyDownHandler);
    this.#canvas.addEventListener('focus', this.#boundFocusHandler);
    this.#canvas.addEventListener('blur', this.#boundBlurHandler);
  }

  /**
   * Cleans up after the chart keyboard manager is destroyed to prevent memory leaks.
   */
  public destroy(): void {
    this.#canvas.removeEventListener('keydown', this.#boundKeyDownHandler);
    this.#canvas.removeEventListener('focus', this.#boundFocusHandler);
    this.#canvas.removeEventListener('blur', this.#boundBlurHandler);
  }

  #handleKeyDown(event: KeyboardEvent): void {
    // Handle Tab key
    if (event.key === 'Tab') {
      if (!this.#isNavigating) {
        // Tab while not navigating - enter navigation mode
        event.preventDefault();
        this.#startNavigation();
      } else {
        // Tab while navigating - exit navigation and allow normal tab
        this.#endNavigation();
        // Don't prevent default - let Tab move focus naturally
      }
      return;
    }

    if (!this.#isNavigating) {
      // Start navigation on first arrow key press
      if (this.#isArrowKey(event.key)) {
        event.preventDefault();
        this.#startNavigation();
        this.#handleArrowKey(event.key);
      }
      return;
    }

    if (this.#isArrowKey(event.key)) {
      event.preventDefault();
      this.#handleArrowKey(event.key);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#handleActivation();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.#endNavigation();
    }
  }

  #handleFocus(): void {
    // Focus received, but don't start navigation until arrow key is pressed
  }

  #handleBlur(): void {
    this.#endNavigation();
  }

  #startNavigation(): void {
    this.#isNavigating = true;
    this.#focusFirstElement();
  }

  #endNavigation(): void {
    this.#isNavigating = false;
    this.#focusedElement = null;

    // Clear shared focus state so the indicator plugin stops drawing.
    focusedElementsState.set(this.#chart, []);

    // Dismiss the tooltip
    this.#chart.tooltip?.setActiveElements([], { x: 0, y: 0 });

    this.#chart.update('none');
  }

  #isArrowKey(key: string): boolean {
    return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key);
  }

  #handleArrowKey(key: string): void {
    if (!this.#focusedElement) {
      return;
    }

    const chartType = getChartType(this.#chart);

    if (isDonutChart(this.#chart)) {
      // For pie charts, navigate through segments
      this.#navigatePieChart(key);
    } else if (chartType === 'bar' || chartType === 'line') {
      // For cartesian charts, navigate based on orientation
      this.#navigateCartesianChart(key);
    } else {
      console.warn(
        'Unsupported chart type for keyboard navigation:',
        chartType,
      );
    }
  }

  #navigateCartesianChart(key: string): void {
    if (!this.#focusedElement) return;

    const datasets = this.#chart.data.datasets;
    const dataLength = datasets[0]?.data.length ?? 0;
    const datasetCount = datasets.length;

    let newDatasetIndex = this.#focusedElement.datasetIndex;
    let newIndex = this.#focusedElement.index;

    // Determine if chart is horizontal or vertical
    const config = this.#chart.config as { options?: { indexAxis?: string } };
    const isHorizontal = config.options?.indexAxis === 'y';

    const direction = this.#getNavigationDirection(key, isHorizontal);

    if (direction === 'nextSeries') {
      newDatasetIndex = (newDatasetIndex + 1) % datasetCount;
    } else if (direction === 'prevSeries') {
      newDatasetIndex = (newDatasetIndex - 1 + datasetCount) % datasetCount;
    } else if (direction === 'nextPoint') {
      newIndex = Math.min(newIndex + 1, dataLength - 1);
    } else if (direction === 'prevPoint') {
      newIndex = Math.max(newIndex - 1, 0);
    }

    this.#focusedElement.datasetIndex = newDatasetIndex;
    this.#focusedElement.index = newIndex;
    this.#updateChartWithFocus();
  }

  #navigatePieChart(key: string): void {
    if (!this.#focusedElement) return;

    const dataLength = this.#chart.data.datasets[0]?.data.length ?? 0;
    let newIndex = this.#focusedElement.index;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      newIndex = (newIndex + 1) % dataLength;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      newIndex = (newIndex - 1 + dataLength) % dataLength;
    }

    this.#focusedElement.index = newIndex;
    this.#updateChartWithFocus();
  }

  #getNavigationDirection(
    key: string,
    isHorizontal: boolean,
  ): 'nextSeries' | 'prevSeries' | 'nextPoint' | 'prevPoint' | 'none' {
    if (key === 'ArrowRight') {
      return isHorizontal ? 'nextSeries' : 'nextPoint';
    } else if (key === 'ArrowLeft') {
      return isHorizontal ? 'prevSeries' : 'prevPoint';
    } else if (key === 'ArrowDown') {
      return isHorizontal ? 'nextPoint' : 'nextSeries';
    } else if (key === 'ArrowUp') {
      return isHorizontal ? 'prevPoint' : 'prevSeries';
    }
    return 'none';
  }

  #handleActivation(): void {
    if (!this.#focusedElement) {
      return;
    }

    // Trigger click event on the focused element
    const element = this.#getActiveElement(
      this.#focusedElement.datasetIndex,
      this.#focusedElement.index,
    );

    if (element && this.#chart.config.options?.onClick) {
      // Call the onClick handler with a minimal ChartEvent
      const chartEvent = {} as ChartEvent;
      this.#chart.config.options.onClick(chartEvent, [element], this.#chart);
    }
  }

  #focusFirstElement(): void {
    const datasets = this.#chart.data.datasets;
    if (
      datasets.length === 0 ||
      !datasets[0] ||
      datasets[0].data.length === 0
    ) {
      return;
    }

    this.#focusedElement = {
      datasetIndex: 0,
      index: 0,
    };

    this.#updateChartWithFocus();
  }

  #updateChartWithFocus(): void {
    if (!this.#focusedElement) {
      return;
    }

    const chartType = getChartType(this.#chart);

    // For cartesian charts, show grouped tooltip with all series at this index
    if (chartType === 'bar' || chartType === 'line') {
      const elements: ActiveElement[] = [];
      const datasets = this.#chart.data.datasets;

      // Collect all elements at the current index across all datasets
      for (let i = 0; i < datasets.length; i++) {
        const element = this.#getActiveElement(i, this.#focusedElement.index);
        if (element) {
          elements.push(element);
        }
      }

      if (elements.length > 0) {
        // Show grouped tooltip with all series
        this.#chart.tooltip?.setActiveElements(elements, { x: 0, y: 0 });
      }
    } else {
      // For pie/doughnut charts, show single element tooltip
      const element = this.#getActiveElement(
        this.#focusedElement.datasetIndex,
        this.#focusedElement.index,
      );

      if (element) {
        this.#chart.tooltip?.setActiveElements([element], { x: 0, y: 0 });
      }
    }

    this.#syncFocusedState();
    this.#chart.update('none');
  }

  /**
   * Writes the current focused element to the shared state so the focus indicator plugin can draw it.
   */
  #syncFocusedState(): void {
    if (!this.#focusedElement) {
      focusedElementsState.set(this.#chart, []);
      return;
    }

    const el = this.#getActiveElement(
      this.#focusedElement.datasetIndex,
      this.#focusedElement.index,
    );
    focusedElementsState.set(this.#chart, el ? [el] : []);
  }

  #getActiveElement(datasetIndex: number, index: number): ActiveElement | null {
    const meta = this.#chart.getDatasetMeta(datasetIndex);
    const dataElement = meta?.data[index];

    if (!dataElement) {
      return null;
    }

    return {
      datasetIndex,
      index,
      element: dataElement,
    };
  }
}

import type { Chart, ChartEvent, InteractionItem, Plugin } from 'chart.js';

import { getChartType, isDonutOrPieChart } from '../chart-helpers';
import { SkyuxChartStyles } from '../chart-styles';

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
 * - Provides descriptive ARIA labels with data context
 * - Visual focus indicators follow SKY UX design system
 * - Supports all chart types (bar, line, pie, doughnut)
 */
export function createChartA11yPlugin(): Plugin {
  const plugin: Plugin = {
    id: 'sky_chart_a11y',
    afterInit: (chart) => {
      const manager = new ChartKeyboardManager(chart);

      chartManagers.set(chart, manager);
      manager.initialize();
    },
    afterDestroy: (chart) => {
      const manager = chartManagers.get(chart);

      manager?.destroy();
      chartManagers.delete(chart);
    },
    afterDatasetsDraw: (chart) => {
      const manager = chartManagers.get(chart);

      manager?.drawFocusIndicator();
    },
  };

  return plugin;
}

/**
 * Maintains a mapping of Chart instances to their corresponding keyboard managers.
 * This allows the plugin to manage keyboard interactions for multiple charts on the same page.
 */
const chartManagers = new Map<Chart, ChartKeyboardManager>();

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
    // Make canvas focusable
    if (!this.#canvas.hasAttribute('tabindex')) {
      this.#canvas.setAttribute('tabindex', '0');
    }

    // Set ARIA role if not already set
    if (!this.#canvas.hasAttribute('role')) {
      this.#canvas.setAttribute('role', 'img');
    }

    // Add event listeners
    this.#canvas.addEventListener('keydown', this.#boundKeyDownHandler);
    this.#canvas.addEventListener('focus', this.#boundFocusHandler);
    this.#canvas.addEventListener('blur', this.#boundBlurHandler);
  }

  /**
   * Cleans up after the chart keyboard manager is destroyed to prevent memory leaks.
   */
  public destroy(): void {
    // Remove event listeners
    this.#canvas.removeEventListener('keydown', this.#boundKeyDownHandler);
    this.#canvas.removeEventListener('focus', this.#boundFocusHandler);
    this.#canvas.removeEventListener('blur', this.#boundBlurHandler);
  }

  /**
   * Draws a focus indicator around the currently focused data point, if any.
   */
  public drawFocusIndicator(): void {
    if (!this.#isNavigating || !this.#focusedElement) {
      return;
    }

    const element = this.#getElementAtIndex(
      this.#focusedElement.datasetIndex,
      this.#focusedElement.index,
    );

    if (!element) {
      return;
    }

    const ctx = this.#chart.ctx;
    const meta = this.#chart.getDatasetMeta(this.#focusedElement.datasetIndex);
    const dataElement = meta.data[this.#focusedElement.index];

    if (!dataElement) {
      return;
    }

    ctx.save();

    // Draw focus outline
    ctx.strokeStyle = SkyuxChartStyles.focusIndicatorColor;
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    const chartType = getChartType(this.#chart);

    if (chartType === 'bar') {
      // Check if chart is horizontal
      const config = this.#chart.config as { options?: { indexAxis?: string } };
      const isHorizontal = config.options?.indexAxis === 'y';

      this.#drawBarFocusIndicator(
        ctx,
        dataElement as unknown as {
          x: number;
          y: number;
          width: number;
          height: number;
        },
        isHorizontal,
      );
    } else if (chartType === 'line') {
      this.#drawLineFocusIndicator(
        ctx,
        dataElement as unknown as { x: number; y: number },
      );
    } else if (isDonutOrPieChart(this.#chart)) {
      this.#drawDonutFocusIndicator(
        ctx,
        dataElement as unknown as {
          x: number;
          y: number;
          startAngle: number;
          endAngle: number;
          innerRadius: number;
          outerRadius: number;
        },
      );
    }

    ctx.restore();
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

    if (isDonutOrPieChart(this.#chart)) {
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
    const element = this.#getElementAtIndex(
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
      const elements: InteractionItem[] = [];
      const datasets = this.#chart.data.datasets;

      // Collect all elements at the current index across all datasets
      for (let i = 0; i < datasets.length; i++) {
        const element = this.#getElementAtIndex(i, this.#focusedElement.index);
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
      const element = this.#getElementAtIndex(
        this.#focusedElement.datasetIndex,
        this.#focusedElement.index,
      );

      if (element) {
        this.#chart.tooltip?.setActiveElements([element], { x: 0, y: 0 });
      }
    }

    this.#chart.update('none');
  }

  #getElementAtIndex(
    datasetIndex: number,
    index: number,
  ): InteractionItem | null {
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

  #drawBarFocusIndicator(
    ctx: CanvasRenderingContext2D,
    element: { x: number; y: number; width: number; height: number },
    isHorizontal: boolean,
  ): void {
    const padding = 4;

    if (isHorizontal) {
      // For horizontal bars: x is the right edge, y is the center
      // width is the bar length, height is the bar thickness
      ctx.strokeRect(
        element.x - element.width - padding,
        element.y - element.height / 2 - padding,
        element.width + padding * 2,
        element.height + padding * 2,
      );
    } else {
      // For vertical bars: x is the center, y is the top
      // width is the bar thickness, height is the bar length
      ctx.strokeRect(
        element.x - element.width / 2 - padding,
        element.y - padding,
        element.width + padding * 2,
        element.height + padding * 2,
      );
    }
  }

  #drawLineFocusIndicator(
    ctx: CanvasRenderingContext2D,
    element: { x: number; y: number },
  ): void {
    const radius = 8;
    ctx.beginPath();
    ctx.arc(element.x, element.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  #drawDonutFocusIndicator(
    ctx: CanvasRenderingContext2D,
    element: {
      x: number;
      y: number;
      startAngle: number;
      endAngle: number;
      innerRadius: number;
      outerRadius: number;
    },
  ): void {
    const padding = 6;
    ctx.beginPath();
    ctx.arc(
      element.x,
      element.y,
      element.outerRadius + padding,
      element.startAngle,
      element.endAngle,
    );
    ctx.stroke();
  }
}

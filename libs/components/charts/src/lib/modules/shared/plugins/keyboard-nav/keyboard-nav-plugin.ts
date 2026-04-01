import type { SkyLiveAnnouncerService } from '@skyux/core';
import type { SkyLibResourcesService } from '@skyux/i18n';

import type {
  ActiveElement,
  Chart,
  ChartEvent,
  ChartType,
  Plugin,
} from 'chart.js';

import { focusedElementsState } from '../plugin-state/focused-elements-state';

import { createNavigationStrategy } from './create-navigation-strategy';
import type {
  SkyKeyboardNavPluginOptions,
  SkyValueLabelFn,
} from './keyboard-nav-plugin-options';
import { ChartKeys, isActivationKey, isNavigationKey } from './keys';
import type { FocusedElement, NavigationStrategy } from './navigation-strategy';

/**
 * Plugin that adds keyboard navigation support to ChartJS charts.
 * Enables users to navigate through data points using arrow keys and interact using Enter/Space.
 *
 * Follows the WAI-ARIA recommendation that pointer interaction must not steal keyboard focus:
 * - **Focus is keyboard-owned.** Once a data point receives keyboard focus (via Tab or arrow keys),
 *   it persists across pointer hover events. Hovering another data point does not move or revoke focus.
 * - **Click clears focus.** Clicking anywhere on the canvas ends keyboard navigation and removes the
 *   focus indicator, returning the chart to pointer-only interaction.
 * - **Hover is independent and pointer-driven.** Moving the mouse over a data point applies hover
 *   styling and updates the tooltip without affecting keyboard focus.
 * - **Both states can be visible simultaneously.** The focus indicator and hover indicator draw
 *   independently; two different data points can be highlighted at the same time.
 *
 * ## Keyboard Navigation
 *
 * ### Getting Started
 * - **Tab** into the chart canvas to start navigation; a focus indicator appears on the first visible data point
 *
 * ### Navigation Keys
 * - **Arrow Keys**: Navigate between data points and series (direction depends on chart type)
 * - **Enter/Space**: Activate the focused element (triggers the chart's `onClick` handler)
 * - **Escape**: Exit navigation and clear the focus indicator
 * - **Tab**: Exit navigation and continue to the next focusable element
 * - **Click**: Exit navigation and clear the focus indicator
 *
 * ### Visual Feedback
 * - Focus indicator highlights the current data point (drawn by the indicator plugin)
 * - Tooltip displays for the focused element
 *
 * ### Screen Reader Support
 * - Current position and value are announced via a live region
 */
export function createKeyboardNavPlugin(
  resources: SkyLibResourcesService,
  liveAnnouncer: SkyLiveAnnouncerService,
): Plugin<ChartType, SkyKeyboardNavPluginOptions> {
  // Maintain a mapping of Chart instances to their corresponding keyboard managers.
  // This allows the plugin to manage keyboard interactions for multiple charts on the same page.
  const chartManagers = new Map<Chart, ChartKeyboardManager>();

  return {
    id: 'sky_keyboard_nav',
    afterInit: (chart, args, options): void => {
      const getValueLabel = options.valueLabel;
      const manager = new ChartKeyboardManager(
        chart,
        resources,
        liveAnnouncer,
        getValueLabel,
      );
      chartManagers.set(chart, manager);
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
 * Manages keyboard interactions for a single chart instance.
 * Navigation logic is delegated to a {@link NavigationStrategy} selected
 * at the start of each navigation session based on the chart type.
 */
class ChartKeyboardManager {
  readonly #chart: Chart;
  readonly #canvas: HTMLCanvasElement;
  readonly #resources: SkyLibResourcesService;
  readonly #liveAnnouncer: SkyLiveAnnouncerService;

  readonly #getValueLabel: SkyValueLabelFn | undefined;

  readonly #boundKeyDownHandler: (e: KeyboardEvent) => void;
  readonly #boundKeyUpHandler: (e: KeyboardEvent) => void;
  readonly #boundFocusHandler: () => void;
  readonly #boundBlurHandler: () => void;
  readonly #boundMouseDownHandler: () => void;

  #focusedElement: FocusedElement | null = null;
  #strategy: NavigationStrategy | null = null;
  #isNavigating = false;
  #focusFromMouse = false;

  constructor(
    chart: Chart,
    resources: SkyLibResourcesService,
    liveAnnouncer: SkyLiveAnnouncerService,
    getValueLabel: SkyValueLabelFn | undefined,
  ) {
    this.#chart = chart;
    this.#canvas = chart.canvas;
    this.#resources = resources;
    this.#liveAnnouncer = liveAnnouncer;
    this.#getValueLabel = getValueLabel;

    // Bind handlers
    this.#boundKeyDownHandler = this.#handleKeyDown.bind(this);
    this.#boundKeyUpHandler = this.#handleKeyUp.bind(this);
    this.#boundFocusHandler = this.#handleFocus.bind(this);
    this.#boundBlurHandler = this.#handleBlur.bind(this);
    this.#boundMouseDownHandler = this.#handleMouseDown.bind(this);

    // Attach handlers to the canvas element
    this.#canvas.addEventListener('keydown', this.#boundKeyDownHandler);
    this.#canvas.addEventListener('keyup', this.#boundKeyUpHandler);
    this.#canvas.addEventListener('focus', this.#boundFocusHandler);
    this.#canvas.addEventListener('blur', this.#boundBlurHandler);
    this.#canvas.addEventListener('mousedown', this.#boundMouseDownHandler);
  }

  /**
   * Cleans up after the chart keyboard manager is destroyed to prevent memory leaks.
   */
  public destroy(): void {
    this.#canvas.removeEventListener('keydown', this.#boundKeyDownHandler);
    this.#canvas.removeEventListener('keyup', this.#boundKeyUpHandler);
    this.#canvas.removeEventListener('focus', this.#boundFocusHandler);
    this.#canvas.removeEventListener('blur', this.#boundBlurHandler);
    this.#canvas.removeEventListener('mousedown', this.#boundMouseDownHandler);
  }

  #handleKeyDown(event: KeyboardEvent): void {
    // Handle Tab key — exit navigation and allow normal tab behavior.
    if (event.key === ChartKeys.Tab) {
      this.#endNavigation();
      return;
    }

    if (!this.#isNavigating) {
      // Start navigation on first arrow key press
      if (isNavigationKey(event.key)) {
        event.preventDefault();
        this.#startNavigation();
        this.#navigate(event.key);
      }
      return;
    }

    if (isNavigationKey(event.key)) {
      event.preventDefault();
      this.#navigate(event.key);
      return;
    }

    // Prevent activation keys running their default behavior on key down since we trigger them on key up.
    if (isActivationKey(event.key)) {
      event.preventDefault();
      return;
    }

    if (event.key === ChartKeys.Escape) {
      event.preventDefault();
      this.#endNavigation();
    }
  }

  #handleKeyUp(event: KeyboardEvent): void {
    if (this.#isNavigating && isActivationKey(event.key)) {
      event.preventDefault();
      this.#handleActivation();
    }
  }

  #handleMouseDown(): void {
    this.#focusFromMouse = true;

    if (this.#isNavigating) {
      this.#endNavigation();
    }
  }

  #handleFocus(): void {
    if (this.#focusFromMouse) {
      this.#focusFromMouse = false;
      return;
    }

    if (!this.#isNavigating) {
      this.#startNavigation();
    }
  }

  #handleBlur(): void {
    this.#endNavigation();
  }

  #startNavigation(): void {
    this.#isNavigating = true;
    this.#strategy = createNavigationStrategy(this.#chart);
    this.#focusFirstElement();
  }

  #endNavigation(): void {
    this.#isNavigating = false;
    this.#focusedElement = null;
    this.#strategy = null;

    // Clear shared focus state so the indicator plugin stops drawing.
    focusedElementsState.set(this.#chart, []);

    // Dismiss the tooltip
    this.#chart.tooltip?.setActiveElements([], { x: 0, y: 0 });

    this.#chart.update('none');
  }

  /**
   * Delegates arrow-key navigation to the active strategy and updates the chart.
   */
  #navigate(key: string): void {
    if (!this.#focusedElement || !this.#strategy) {
      return;
    }

    this.#focusedElement = this.#strategy.navigate(key, this.#focusedElement);
    this.#updateChartWithFocus();
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
      const chartEvent = {} as ChartEvent;
      this.#chart.config.options.onClick(chartEvent, [element], this.#chart);
    }
  }

  #focusFirstElement(): void {
    const datasets = this.#chart.data.datasets;

    for (let i = 0; i < datasets.length; i++) {
      const meta = this.#chart.getDatasetMeta(i);

      if (!meta.hidden && datasets[i] && datasets[i].data.length > 0) {
        this.#focusedElement = { datasetIndex: i, index: 0 };
        this.#updateChartWithFocus();
        return;
      }
    }
  }

  /**
   * Updates the tooltip and focus indicator state, then redraws the chart.
   */
  #updateChartWithFocus(): void {
    if (!this.#focusedElement || !this.#strategy) {
      return;
    }

    const tooltipElements = this.#strategy.getTooltipElements(
      this.#chart,
      this.#focusedElement,
    );

    if (tooltipElements.length > 0) {
      this.#chart.tooltip?.setActiveElements(tooltipElements, { x: 0, y: 0 });
    }

    this.#syncFocusedState();
    this.#announcePosition();
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

  /**
   * Announces the current focused element's position and value to screen readers.
   */
  #announcePosition(): void {
    if (!this.#focusedElement || !this.#strategy) {
      return;
    }

    const description = this.#strategy.describeElement(
      this.#chart,
      this.#focusedElement,
    );

    // Override with consumer-formatted label when available.
    if (this.#getValueLabel) {
      description.value = this.#getValueLabel(
        this.#focusedElement.datasetIndex,
        this.#focusedElement.index,
      );
    }

    if (description.totalSeries === 1) {
      this.#resources
        .getString(
          'chart.focus_element.single_series.description',
          description.categoryLabel,
          description.value,
          description.index,
          description.total,
        )
        .subscribe((message) => this.#liveAnnouncer.announce(message));
    } else {
      this.#resources
        .getString(
          'chart.focus_element.multi_series.description',
          description.seriesLabel,
          description.seriesIndex,
          description.totalSeries,
          description.categoryLabel,
          description.value,
          description.index,
          description.total,
        )
        .subscribe((message) => this.#liveAnnouncer.announce(message));
    }
  }

  #getActiveElement(datasetIndex: number, index: number): ActiveElement | null {
    const meta = this.#chart.getDatasetMeta(datasetIndex);
    const dataElement = meta?.data[index];

    if (!dataElement) {
      return null;
    }

    return { datasetIndex, index, element: dataElement };
  }
}

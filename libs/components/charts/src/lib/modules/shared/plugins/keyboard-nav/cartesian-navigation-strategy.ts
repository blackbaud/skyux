import type { ActiveElement, Chart } from 'chart.js';

import type { NavigationKey } from './keys';
import type {
  ElementDescription,
  FocusedElement,
  NavigationStrategy,
} from './navigation-strategy';

/**
 * Navigation strategy for cartesian charts (bar, line, combo).
 * - Left/Right navigate between data points (categories) in vertical charts,
 *   and between series (datasets) in horizontal charts.
 * - Up/Down navigate between series (datasets) in vertical charts,
 *   and between data points (categories) in horizontal charts.
 *
 * Handles variable-length datasets and skips hidden datasets when cycling series.
 * Tooltip shows all datasets at the focused index (grouped tooltip).
 */
export class CartesianNavigationStrategy implements NavigationStrategy {
  readonly #chart: Chart;
  readonly #isHorizontal: boolean;

  constructor(chart: Chart) {
    this.#chart = chart;
    this.#isHorizontal = chart.config.options?.indexAxis === 'y';
  }

  /** @inheritdoc */
  public navigate(key: NavigationKey, current: FocusedElement): FocusedElement {
    const datasets = this.#chart.data.datasets;
    const datasetCount = datasets.length;

    let newDatasetIndex = current.datasetIndex;
    let newIndex = current.index;

    const direction = this.#getDirection(key);

    switch (direction) {
      case 'nextSeries':
        newDatasetIndex = this.#findVisibleDataset(current.datasetIndex, 1);
        break;
      case 'prevSeries':
        newDatasetIndex = this.#findVisibleDataset(current.datasetIndex, -1);
        break;
      case 'nextPoint': {
        const maxIndex = this.#getDataLength(newDatasetIndex) - 1;
        newIndex = Math.min(newIndex + 1, maxIndex);
        break;
      }
      case 'prevPoint':
        newIndex = Math.max(newIndex - 1, 0);
        break;
    }

    // After switching series, clamp the index to the new dataset's range.
    if (direction === 'nextSeries' || direction === 'prevSeries') {
      const newDataLength = this.#getDataLength(newDatasetIndex);
      newIndex = Math.min(newIndex, newDataLength - 1);
    }

    // Guard against empty charts.
    if (datasetCount === 0 || newIndex < 0) {
      return current;
    }

    return { datasetIndex: newDatasetIndex, index: newIndex };
  }

  /** @inheritdoc */
  public getTooltipElements(
    chart: Chart,
    focused: FocusedElement,
  ): ActiveElement[] {
    const elements: ActiveElement[] = [];
    const datasets = chart.data.datasets;

    // Collect all visible elements at the focused index across all datasets (grouped tooltip).
    for (let i = 0; i < datasets.length; i++) {
      if (!chart.isDatasetVisible(i)) {
        continue;
      }

      const element = this.#getActiveElement(i, focused.index);
      if (element) {
        elements.push(element);
      }
    }

    return elements;
  }

  /** @inheritdoc */
  public describeElement(
    chart: Chart,
    focused: FocusedElement,
  ): ElementDescription {
    const dataset = chart.data.datasets[focused.datasetIndex];

    return {
      seriesLabel: String(dataset?.label ?? ''),
      seriesIndex: focused.datasetIndex + 1,
      totalSeries: chart.data.datasets.length,
      categoryLabel: String(chart.data.labels?.[focused.index] ?? ''),
      value: String(dataset?.data[focused.index] ?? ''),
      index: focused.index + 1,
      total: dataset?.data.length ?? 0,
    };
  }

  #getDirection(key: NavigationKey): Direction {
    const mapping: Record<NavigationKey, Direction> = this.#isHorizontal
      ? {
          ArrowRight: 'nextSeries',
          ArrowLeft: 'prevSeries',
          ArrowDown: 'nextPoint',
          ArrowUp: 'prevPoint',
        }
      : {
          ArrowRight: 'nextPoint',
          ArrowLeft: 'prevPoint',
          ArrowDown: 'nextSeries',
          ArrowUp: 'prevSeries',
        };

    return mapping[key];
  }

  /**
   * Finds the next visible dataset index in the given step direction, wrapping around.
   * Returns the current index if no other visible dataset exists.
   */
  #findVisibleDataset(currentIndex: number, step: 1 | -1): number {
    const count = this.#chart.data.datasets.length;
    let candidate = currentIndex;

    for (let i = 0; i < count; i++) {
      candidate = (candidate + step + count) % count;

      if (this.#chart.isDatasetVisible(candidate)) {
        return candidate;
      }
    }

    // All datasets hidden — stay put.
    return currentIndex;
  }

  #getDataLength(datasetIndex: number): number {
    return this.#chart.data.datasets[datasetIndex]?.data.length ?? 0;
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

/**
 * Defines the possible navigation directions based on key input and chart orientation.
 */
type Direction = 'nextSeries' | 'prevSeries' | 'nextPoint' | 'prevPoint';

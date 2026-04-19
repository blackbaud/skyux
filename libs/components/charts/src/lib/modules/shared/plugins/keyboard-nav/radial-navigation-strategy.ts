import type { ActiveElement, Chart } from 'chart.js';

import { ChartKeys, type NavigationKey } from './keys';
import type {
  ElementDescription,
  FocusedElement,
  NavigationStrategy,
} from './navigation-strategy';

/**
 * Navigation strategy for radial charts (doughnut, pie).
 * All arrow keys cycle through segments in a single ring:
 * - Right/Down advance to the next segment (wrapping).
 * - Left/Up move to the previous segment (wrapping).
 *
 * Tooltip shows only the focused segment.
 */
export class RadialNavigationStrategy implements NavigationStrategy {
  readonly #chart: Chart;

  constructor(chart: Chart) {
    this.#chart = chart;
  }

  public navigate(key: NavigationKey, current: FocusedElement): FocusedElement {
    const dataLength = this.#chart.data.datasets[0]?.data.length ?? 0;

    if (dataLength === 0) {
      return current;
    }

    let newIndex = current.index;

    if (
      key === ChartKeys.Navigation.ArrowRight ||
      key === ChartKeys.Navigation.ArrowDown
    ) {
      newIndex = (newIndex + 1) % dataLength;
    } else if (
      key === ChartKeys.Navigation.ArrowLeft ||
      key === ChartKeys.Navigation.ArrowUp
    ) {
      newIndex = (newIndex - 1 + dataLength) % dataLength;
    }

    return { datasetIndex: current.datasetIndex, index: newIndex };
  }

  public getTooltipElements(
    chart: Chart,
    focused: FocusedElement,
  ): ActiveElement[] {
    const meta = chart.getDatasetMeta(focused.datasetIndex);
    const dataElement = meta?.data[focused.index];

    if (!dataElement) {
      return [];
    }

    return [
      {
        datasetIndex: focused.datasetIndex,
        index: focused.index,
        element: dataElement,
      },
    ];
  }

  public describeElement(
    chart: Chart,
    focused: FocusedElement,
  ): ElementDescription {
    const dataset = chart.data.datasets[focused.datasetIndex];
    const datasetLabel = String(dataset?.label ?? '');
    const segmentLabel = chart.data.labels?.[focused.index] ?? datasetLabel;

    return {
      seriesLabel: datasetLabel,
      seriesIndex: focused.datasetIndex + 1,
      totalSeries: chart.data.datasets.length,
      categoryLabel: String(segmentLabel),
      value: String(dataset?.data[focused.index] ?? ''),
      index: focused.index + 1,
      total: dataset?.data.length ?? 0,
    };
  }
}

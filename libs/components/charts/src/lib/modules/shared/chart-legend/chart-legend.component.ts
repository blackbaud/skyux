import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  signal,
  viewChildren,
} from '@angular/core';

import { Chart, LegendItem } from 'chart.js';

import { getChartType } from '../chart-helpers';
import { SkyChartsResourcesModule } from '../sky-charts-resources.module';

@Component({
  selector: 'sky-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss',
  imports: [SkyChartsResourcesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartLegendComponent {
  /** The Chart instance */
  public readonly chart = input<Chart | undefined>();

  /** The list of legend item buttons */
  protected readonly legendButtons =
    viewChildren<ElementRef<HTMLButtonElement>>('legendButton');

  protected readonly legendItems = signal<SkyChartLegendItem[]>([]);
  protected readonly hasLegendItems = computed(
    () => this.legendItems().length > 0,
  );
  protected readonly activeLegendIndex = signal(0);

  constructor() {
    effect(() => {
      const chart = this.chart();
      if (chart) {
        this.#updateLegendItems();
      }
    });

    effect(() => {
      const count = this.legendItems().length;
      const index = this.activeLegendIndex();

      if (count <= 0) {
        this.activeLegendIndex.set(0);
      } else if (index > count - 1) {
        this.activeLegendIndex.set(count - 1);
      }
    });
  }

  protected onLegendFocusIn(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement | null;
    const related = event.relatedTarget as Node | null;
    const enteredFromOutside = !related || !host?.contains(related);

    if (enteredFromOutside) {
      this.activeLegendIndex.set(0);
      this.#focusLegendButton(0);
    }
  }

  protected onLegendKeydown(event: KeyboardEvent): void {
    const count = this.legendItems().length;

    if (count === 0) {
      return;
    }

    const current = this.activeLegendIndex();
    let next = current;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (current + 1) % count;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (current - 1 + count) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleLegendItem(this.legendItems()[current], current);
        return;
      default:
        return;
    }

    event.preventDefault();
    this.activeLegendIndex.set(next);
    this.#focusLegendButton(next);
  }

  protected onLegendButtonFocus(index: number): void {
    if (this.activeLegendIndex() !== index) {
      this.activeLegendIndex.set(index);
    }
  }

  protected toggleLegendItem(item: SkyChartLegendItem, index?: number): void {
    if (index !== undefined) {
      this.activeLegendIndex.set(index);
    }

    const chart = this.chart();

    if (!chart) {
      return;
    }

    const chartType = getChartType(chart);

    if (chartType === 'pie' || chartType === 'doughnut') {
      chart.toggleDataVisibility(item.index);
    } else {
      chart.setDatasetVisibility(
        item.datasetIndex,
        !chart.isDatasetVisible(item.datasetIndex),
      );
    }

    chart.update();
    this.#updateLegendItems();
  }

  #updateLegendItems(): void {
    const chart = this.chart();

    if (!chart) {
      this.legendItems.set([]);
      return;
    }

    const labels = chart.options.plugins?.legend?.labels;
    const legendItems = labels?.generateLabels?.(chart) ?? [];

    this.legendItems.set(
      legendItems.map((item) => this.#toLegendItem(chart, item)),
    );
  }

  #toLegendItem(chart: Chart, item: LegendItem): SkyChartLegendItem {
    const chartType = getChartType(chart);
    const itemIndex = item.index ?? 0;
    const datasetIndex = item.datasetIndex ?? itemIndex;
    const isVisible =
      chartType === 'pie' || chartType === 'doughnut'
        ? chart.getDataVisibility(itemIndex)
        : chart.isDatasetVisible(datasetIndex);

    return {
      datasetIndex: datasetIndex,
      index: itemIndex,
      isVisible: isVisible,
      label: item.text,
      legendMarker: {
        fillStyle: String(item.fillStyle ?? 'transparent'),
        lineWidth: Number(item.lineWidth ?? 0),
        strokeStyle: String(item.strokeStyle ?? 'transparent'),
      },
    };
  }

  #focusLegendButton(index: number): void {
    const button = this.legendButtons()[index]?.nativeElement;
    button?.focus();
  }
}

interface SkyChartLegendItem {
  /** The dataset index */
  datasetIndex: number;
  /** The legend item index */
  index: number;
  /** Is the dataset visible in the chart */
  isVisible: boolean;
  /** The legend item's label */
  label: string;
  /** The legend marker styling */
  legendMarker: {
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
  };
}

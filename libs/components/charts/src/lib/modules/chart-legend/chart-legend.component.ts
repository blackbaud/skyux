import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { SkyIdModule } from '@skyux/core';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import { SkyChartLegendItem } from './chart-legend-item';

@Component({
  selector: 'sky-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss',
  imports: [SkyChartsResourcesModule, SkyIdModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartLegendComponent {
  /** The legend items */
  public readonly legendItems = input.required<SkyChartLegendItem[]>();

  /** Emits when a legend item is toggled (clicked or activated via keyboard). */
  public readonly legendItemToggled = output<SkyChartLegendItem>();

  /** The list of legend item buttons */
  protected readonly legendButtons =
    viewChildren<ElementRef<HTMLButtonElement>>('legendButton');

  protected readonly hasLegendItems = computed(
    () => this.legendItems().length > 0,
  );
  protected readonly activeLegendIndex = signal(0);

  readonly #isLastVisible = computed(() => {
    const visibleLegendItems = this.legendItems().filter(
      (i) => i.isVisible,
    ).length;
    return visibleLegendItems === 1;
  });

  constructor() {
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

  /**
   * When focus enters the legend from outside, set the active index to the first legend item and focus it.
   * @param event The focus event
   */
  protected onLegendFocusIn(event: FocusEvent): void {
    const host = event.currentTarget;
    const related = event.relatedTarget;
    const enteredFromOutside =
      host instanceof HTMLElement &&
      related instanceof HTMLElement &&
      !host.contains(related);

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

  protected isItemDisabled(item: SkyChartLegendItem): boolean {
    return item.isVisible && this.#isLastVisible();
  }

  protected toggleLegendItem(item: SkyChartLegendItem, index?: number): void {
    // Guard against toggling the last visible item off, which would leave the chart without any visible data.
    if (this.isItemDisabled(item)) {
      return;
    }

    if (item.isVisible && index !== undefined) {
      this.activeLegendIndex.set(index);
    }

    this.legendItemToggled.emit(item);
  }

  #focusLegendButton(index: number): void {
    const button = this.legendButtons()[index]?.nativeElement;
    button?.focus();
  }
}

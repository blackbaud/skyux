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

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import { SkyChartLegendItem } from './chart-legend-item';

@Component({
  selector: 'sky-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss',
  imports: [SkyChartsResourcesModule],
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

    this.legendItemToggled.emit(item);
  }

  #focusLegendButton(index: number): void {
    const button = this.legendButtons()[index]?.nativeElement;
    button?.focus();
  }
}

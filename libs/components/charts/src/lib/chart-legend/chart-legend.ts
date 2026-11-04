import {
  Component,
  computed,
  type ElementRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';

import { SkyChart } from '../chart/chart';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

/**
 * @internal
 */
export interface SkyChartLegendItem {
  labelText: string;
  color: string;
  hidden: boolean;
}

/**
 * Renders a chart's legend as a toolbar of HTML toggle buttons. Chart.js draws
 * its own legend onto the canvas, which cannot receive keyboard focus. The
 * toolbar is a single tab stop; arrow keys, Home, and End move focus between
 * items (https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/).
 * @internal
 */
@Component({
  imports: [SkyChartsResourcesModule],
  selector: 'sky-chart-legend',
  styleUrl: './chart-legend.scss',
  templateUrl: './chart-legend.html',
})
export class SkyChartLegend {
  public readonly items = input.required<readonly SkyChartLegendItem[]>();

  /**
   * Fires with the index of the item whose visibility the user toggled.
   */
  public readonly itemToggle = output<number>();

  protected readonly headingText = inject(SkyChart).headingText;

  protected readonly focusedIndex = signal(0);

  // Clamped so a tab stop remains when items are removed.
  protected readonly activeIndex = computed(() =>
    Math.min(this.focusedIndex(), this.items().length - 1),
  );

  private readonly itemButtons =
    viewChildren<ElementRef<HTMLButtonElement>>('legendItem');

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const lastIndex = this.items().length - 1;
    let targetIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        targetIndex = index === lastIndex ? 0 : index + 1;
        break;
      case 'ArrowLeft':
        targetIndex = index === 0 ? lastIndex : index - 1;
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.itemButtons()[targetIndex].nativeElement.focus();
  }
}

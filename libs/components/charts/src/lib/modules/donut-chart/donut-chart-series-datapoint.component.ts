import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';

import { SkyCategory } from '../shared/types/category';

import { SkyDonutChartRegistry } from './donut-chart-registry.service';
import { SkyDonutChartSeriesComponent } from './donut-chart-series.component';
import { SkyDonutChartSlice, SkyDonutDatum } from './donut-chart-types';

/**
 * Represents a single data point within a donut chart series.
 */
@Component({
  selector: 'sky-donut-chart-series-datapoint',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDonutChartSeriesDatapointComponent implements OnDestroy {
  readonly #registry = inject(SkyDonutChartRegistry);
  readonly #series = inject(SkyDonutChartSeriesComponent);

  /**
   * The category bucket this data point belongs to (e.g. a month name or a label on the category axis).
   */
  public readonly category = input.required<SkyCategory>();

  /**
   * The human-readable label shown in tooltips for this data point (e.g. "$10,000").
   */
  public readonly labelText = input.required<string>();

  /**
   * The numeric value for this data point.
   * Accepts a single number, a floating-bar range `[min, max]`, or `null` for a gap.
   */
  public readonly value = input.required<SkyDonutDatum>();

  /**
   * The data point object
   * @internal
   */
  public readonly datapoint = computed<SkyDonutChartSlice>(() => {
    return {
      category: this.category(),
      label: this.labelText(),
      value: this.value(),
    };
  });

  constructor() {
    effect(() => {
      const datapoint = this.datapoint();
      this.#registry.upsertPoint(this.#series.id, datapoint);
    });
  }

  public ngOnDestroy(): void {
    this.#registry.removePoint(this.#series.id, this.category());
  }
}

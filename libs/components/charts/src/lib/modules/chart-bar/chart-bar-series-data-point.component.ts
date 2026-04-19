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

import { SkyChartBarRegistry } from './chart-bar-registry.service';
import { SkyChartBarSeriesComponent } from './chart-bar-series.component';
import { SkyChartBarDatum, SkyChartBarPoint } from './chart-bar-types';

let nextId = 0;

/**
 * Represents a single data point within a chart series.
 */
@Component({
  selector: 'sky-chart-bar-series-datapoint',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartBarSeriesDataPointComponent implements OnDestroy {
  readonly #registry = inject(SkyChartBarRegistry);
  readonly #series = inject(SkyChartBarSeriesComponent);

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
   */
  public readonly value = input.required<SkyChartBarDatum>();

  /**
   * A unique ID for this data point component instance.
   */
  readonly #id = nextId++;

  readonly #datapoint = computed<SkyChartBarPoint>(() => {
    return {
      id: this.#id,
      category: this.category(),
      labelText: this.labelText(),
      value: this.value(),
    };
  });

  constructor() {
    effect(() => {
      const datapoint = this.#datapoint();
      this.#registry.upsertPoint(this.#series.id, datapoint);
    });
  }

  public ngOnDestroy(): void {
    this.#registry.removePoint(this.#series.id, this.#id);
  }
}

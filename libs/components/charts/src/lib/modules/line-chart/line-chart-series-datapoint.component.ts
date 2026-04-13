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

import { SkyLineChartRegistry } from './line-chart-registry.service';
import { SkyLineChartSeriesComponent } from './line-chart-series.component';
import { SkyLineChartPoint, SkyLineDatum } from './line-chart-types';

let nextId = 0;

/**
 * Represents a single data point within a line chart series.
 */
@Component({
  selector: 'sky-line-chart-series-datapoint',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartSeriesDatapointComponent implements OnDestroy {
  readonly #registry = inject(SkyLineChartRegistry);
  readonly #series = inject(SkyLineChartSeriesComponent);

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
  public readonly value = input.required<SkyLineDatum>();

  /**
   * A unique ID for this data point component instance.
   */
  readonly #id = nextId++;

  readonly #datapoint = computed<SkyLineChartPoint>(() => {
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

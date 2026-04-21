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

import { SkyChartLineRegistry } from './chart-line-registry.service';
import {
  SKY_CHART_LINE_SERIES_ID,
  SkyChartLineDatum,
  SkyChartLinePoint,
} from './chart-line-types';

let nextId = 0;

/**
 * Represents a single data point within a line chart series.
 */
@Component({
  selector: 'sky-chart-line-series-datapoint',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartLineSeriesDataPointComponent implements OnDestroy {
  readonly #registry = inject(SkyChartLineRegistry);
  readonly #seriesId = inject(SKY_CHART_LINE_SERIES_ID);

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
  public readonly value = input.required<SkyChartLineDatum>();

  /**
   * A unique ID for this data point component instance.
   */
  readonly #id = nextId++;

  readonly #datapoint = computed<SkyChartLinePoint>(() => {
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
      this.#registry.upsertPoint(this.#seriesId, datapoint);
    });
  }

  public ngOnDestroy(): void {
    this.#registry.removePoint(this.#seriesId, this.#id);
  }
}

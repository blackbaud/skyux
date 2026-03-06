import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';

import { SkyChartSeries } from '../shared/types/chart-series';

import { SkyDonutChartRegistry } from './donut-chart-registry.service';
import { SkyDonutChartSlice } from './donut-chart-types';

let nextId = 0;

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-donut-chart-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDonutChartSeriesComponent implements OnDestroy {
  readonly #registry = inject(SkyDonutChartRegistry);

  /**
   * The display label for this series. Shown in the chart legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * A unique ID for this series component instance.
   */
  public readonly id = nextId++;

  readonly #series = computed<SkyChartSeries<SkyDonutChartSlice>>(() => ({
    id: this.id,
    labelText: this.labelText(),
    data: [], // Data will be dynamically set from children datapoints
  }));

  constructor() {
    effect(() => {
      const series = this.#series();
      this.#registry.upsertSeries(series);
    });
  }

  public ngOnDestroy(): void {
    this.#registry.removeSeries(this.id);
  }
}

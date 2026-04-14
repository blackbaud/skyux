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

import { SkyChartDonutRegistry } from './chart-donut-registry.service';
import { SkyChartDonutSlice } from './chart-donut-types';

let nextId = 0;

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-chart-donut-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartDonutSeriesComponent implements OnDestroy {
  readonly #registry = inject(SkyChartDonutRegistry);

  /**
   * The display label for this series. Shown in the chart legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * A unique ID for this series component instance.
   * @internal
   */
  public readonly id = nextId++;

  readonly #series = computed<SkyChartSeries<SkyChartDonutSlice>>(() => ({
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

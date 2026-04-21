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

import { SkyChartBarRegistry } from './chart-bar-registry.service';
import { SKY_CHART_BAR_SERIES_ID, SkyChartBarPoint } from './chart-bar-types';

let nextId = 0;

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-chart-bar-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SKY_CHART_BAR_SERIES_ID,
      useFactory: (): number => nextId++,
    },
  ],
})
export class SkyChartBarSeriesComponent implements OnDestroy {
  readonly #registry = inject(SkyChartBarRegistry);
  readonly #id = inject(SKY_CHART_BAR_SERIES_ID);

  /**
   * The display label for this series. Shown in the chart legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * A unique ID for this series component instance.
   */
  readonly #series = computed<SkyChartSeries<SkyChartBarPoint>>(() => ({
    id: this.#id,
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
    this.#registry.removeSeries(this.#id);
  }
}

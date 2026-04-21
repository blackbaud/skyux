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

import { SkyChartLineRegistry } from './chart-line-registry.service';
import {
  SKY_CHART_LINE_SERIES_ID,
  SkyChartLinePoint,
} from './chart-line-types';

let nextId = 0;

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-chart-line-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SKY_CHART_LINE_SERIES_ID,
      useFactory: (): number => nextId++,
    },
  ],
})
export class SkyChartLineSeriesComponent implements OnDestroy {
  readonly #registry = inject(SkyChartLineRegistry);
  readonly #id = inject(SKY_CHART_LINE_SERIES_ID);

  /**
   * The display label for this series. Shown in the chart legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * A unique ID for this series component instance.
   */
  readonly #series = computed<SkyChartSeries<SkyChartLinePoint>>(() => ({
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

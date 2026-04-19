import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  contentChildren,
  effect,
  inject,
  input,
} from '@angular/core';

import { SkyChartSeries } from '../shared/types/chart-series';

import { SkyChartLineRegistry } from './chart-line-registry.service';
import { SkyChartLineSeriesDataPointComponent } from './chart-line-series-data-point.component';
import { SkyChartLinePoint } from './chart-line-types';

let nextId = 0;

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-chart-line-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartLineSeriesComponent implements OnDestroy {
  readonly #registry = inject(SkyChartLineRegistry);

  /**
   * The display label for this series. Shown in the chart legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * The data points that belong to this series.
   */
  protected readonly datapoints = contentChildren(
    SkyChartLineSeriesDataPointComponent,
  );

  /**
   * A unique ID for this series component instance.
   * @internal
   */
  public readonly id = nextId++;

  readonly #series = computed<SkyChartSeries<SkyChartLinePoint>>(() => ({
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

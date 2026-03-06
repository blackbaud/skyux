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

import { SkyLineChartRegistry } from './line-chart-registery.service';
import { SkyLineChartSeriesDatapointComponent } from './line-chart-series-datapoint.component';
import { SkyLineChartPoint } from './line-chart-types';

let nextId = 0;

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-line-chart-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartSeriesComponent implements OnDestroy {
  readonly #registry = inject(SkyLineChartRegistry);

  /**
   * The display label for this series. Shown in the chart legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * The data points that belong to this series.
   */
  protected readonly datapoints = contentChildren(
    SkyLineChartSeriesDatapointComponent,
  );

  /**
   * A unique ID for this series component instance.
   */
  public readonly id = nextId++;

  readonly #series = computed<SkyChartSeries<SkyLineChartPoint>>(() => ({
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

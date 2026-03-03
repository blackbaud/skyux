import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  contentChildren,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { SkyChartSeries } from '../shared/types/chart-series';

import { SkyLineChartSeriesDatapointComponent } from './line-chart-series-datapoint.component';
import { SkyLineChartPoint } from './line-chart-types';

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-line-chart-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartSeriesComponent implements AfterContentInit {
  readonly #injector = inject(Injector);

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
   * The series data
   * @internal
   */
  public readonly series = signal<SkyChartSeries<SkyLineChartPoint>>({
    label: '',
    data: [],
  });

  public ngAfterContentInit(): void {
    // This effect runs whenever the Series' label any children datapoint change
    effect(
      () => {
        const datapoints = this.datapoints().map((d) => d.datapoint());
        this.series.set({ label: this.labelText(), data: datapoints });
      },
      { injector: this.#injector },
    );
  }
}

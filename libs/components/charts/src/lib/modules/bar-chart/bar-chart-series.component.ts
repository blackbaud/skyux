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

import { SkyBarChartSeriesDatapointComponent } from './bar-chart-series-datapoint.component';
import { SkyBarChartPoint } from './bar-chart-types';

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-bar-chart-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBarChartSeriesComponent implements AfterContentInit {
  readonly #injector = inject(Injector);

  /**
   * The display label for this series. Shown in the chart legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * The data points that belong to this series.
   */
  protected readonly datapoints = contentChildren(
    SkyBarChartSeriesDatapointComponent,
  );

  /**
   * The series data
   * @internal
   */
  public readonly series = signal<SkyChartSeries<SkyBarChartPoint>>({
    label: '',
    data: [],
  });

  public ngAfterContentInit(): void {
    // This effect runs whenever the Series' label any children datapoint change
    effect(
      () => {
        const datapoints = this.datapoints().map((d) => d.datapoint());

        this.series.set({
          label: this.labelText(),
          data: datapoints,
        });
      },
      { injector: this.#injector },
    );
  }
}

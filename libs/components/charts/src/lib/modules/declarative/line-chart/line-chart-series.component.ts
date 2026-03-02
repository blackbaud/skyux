import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
} from '@angular/core';

import { SkyLineChartSeriesDatapointComponent } from './line-chart-series-datapoint.component';

/**
 * Represents a named data series in a chart.
 */
@Component({
  selector: 'sky-line-chart-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartSeriesComponent {
  /**
   * The display label for this series. Shown in the chart legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * @internal
   */
  public readonly datapoints = contentChildren(
    SkyLineChartSeriesDatapointComponent,
  );
}

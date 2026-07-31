import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type SkyChartLineSeriesValue } from './chart-line-series-value';

/**
 * Defines a single series of values to plot on a line chart, aligned to the
 * category axis by index.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-line-series',
  template: '',
})
export class SkyChartLineSeries {
  /**
   * The text that identifies this series in the legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * The values for this series, aligned to the category axis categories by
   * index. A number renders a point on the line, and a `null` value renders
   * a gap in the line and an empty cell in the data table.
   */
  public readonly values = input.required<readonly SkyChartLineSeriesValue[]>();
}

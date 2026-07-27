import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type SkyChartBarSeriesValue } from './chart-bar-series-value';

/**
 * Defines a single series of values to plot on a bar chart, aligned to the
 * category axis by index.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-bar-series',
  template: '',
})
export class SkyChartBarSeries {
  /**
   * The text that identifies this series in the legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * The stack this series belongs to. When a bar chart's `seriesLayout`
   * is `stacked`, series that share the same `stackId` value accumulate into
   * a single bar per category, and series with different `stackId` values
   * are placed side by side. Omit to stack every series into one bar per
   * category. Has no effect when `seriesLayout` is `grouped`.
   */
  public readonly stackId = input<string>();

  /**
   * The values for this series, aligned to the category axis categories by
   * index. A number renders a standard bar measured from the value axis's
   * baseline, a `[start, end]` tuple renders a floating bar spanning the two
   * values, and a `null` value renders a gap in the chart and an empty cell
   * in the data table.
   */
  public readonly values = input.required<readonly SkyChartBarSeriesValue[]>();
}

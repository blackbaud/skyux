import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
   * The stack group this series belongs to. When a bar chart's `seriesLayout`
   * is `stacked`, series that share the same `stackGroup` value accumulate into
   * a single bar per category, and series with different `stackGroup` values
   * are placed side by side. Omit to stack every series into one bar per
   * category. Has no effect when `seriesLayout` is `grouped`.
   */
  public readonly stackGroup = input<string>();

  /**
   * The values for this series, aligned to the category axis categories by
   * index.
   */
  public readonly values = input.required<readonly number[]>();
}

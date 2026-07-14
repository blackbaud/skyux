import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Defines a single series of values to plot on a chart, aligned to the
 * category axis by index.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-series',
  template: '',
})
export class SkyChartSeries {
  /**
   * The text that identifies this series in the legend and tooltips.
   */
  public readonly labelText = input.required<string>();

  /**
   * The `axisId` of the value axis to plot this series against. Defaults to the
   * first value axis.
   */
  public readonly valueAxisId = input<string>();

  /**
   * The values for this series, aligned to the category axis categories by
   * index.
   */
  public readonly values = input.required<readonly number[]>();
}

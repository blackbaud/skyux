import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-value-axis',
  template: ``,
})
export class SkyChartValueAxis {
  /**
   * A unique identifier that series use to bind to this axis. Required when a
   * chart has more than one value axis.
   */
  public readonly axisId = input<string>();

  /**
   * Whether to hide the axis label.
   */
  public readonly labelHidden = input(false, { transform: booleanAttribute });

  /**
   * The text of the axis label.
   */
  public readonly labelText = input.required<string>();
}

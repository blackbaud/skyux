import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Defines the category axis of a chart. Its categories are shared by every
 * series plotted against it, and each series' values align to them by index.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-axis-category',
  template: '',
})
export class SkyChartAxisCategory {
  /**
   * The categories shared by every series plotted against this axis. Each
   * series' values are aligned to these categories by index.
   */
  public readonly categories = input.required<readonly (string | number)[]>();

  /**
   * Whether to hide the axis label.
   */
  public readonly labelHidden = input(false, { transform: booleanAttribute });

  /**
   * The text of the axis label.
   */
  public readonly labelText = input.required<string>();
}

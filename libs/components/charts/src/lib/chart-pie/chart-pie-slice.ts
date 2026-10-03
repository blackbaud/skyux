import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
} from '@angular/core';

/**
 * Defines a single slice of a pie chart. Slice sizes are proportional to
 * their values.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-pie-slice',
  template: '',
})
export class SkyChartPieSlice {
  /**
   * The text that identifies this slice in the legend, tooltips, and the
   * data table.
   */
  public readonly labelText = input.required<string>();

  /**
   * The value of this slice.
   */
  public readonly value = input.required<number, unknown>({
    transform: numberAttribute,
  });
}

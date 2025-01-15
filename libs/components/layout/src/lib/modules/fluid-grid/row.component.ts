import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

/**
 * Displays a row within the `sky-fluid-grid` wrapper. Previously, you could display a row
 * without a wrapper, but we no longer officially support that option.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-row',
    '[class.sky-row-reverse]': 'reverseColumnOrder()',
  },
  selector: 'sky-row',
  template: '<ng-content />',
  styleUrl: './row.component.scss',
})
export class SkyRowComponent {
  /**
   * Whether to reverse the display order for columns in the row.
   */
  public reverseColumnOrder = input(false, {
    transform: booleanAttribute,
  });
}

import { Component, Input } from '@angular/core';

/**
 * Displays a row within the `sky-fluid-grid` wrapper. Previously, you could display a row
 * without a wrapper, but we no longer officially support that option.
 */
@Component({
  selector: 'sky-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
  standalone: false,
})
export class SkyRowComponent {
  /**
   * Whether to reverse the display order for columns in the row.
   * @default false
   */
  @Input()
  public reverseColumnOrder: boolean | undefined = false;
}

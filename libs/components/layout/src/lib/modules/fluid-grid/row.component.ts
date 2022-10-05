import { Component, Input } from '@angular/core';

/**
 * Displays a row within the `sky-fluid-grid` wrapper. Previously, you could display a row
 * without a wrapper, but we no longer officially support that option.
 */
@Component({
  selector: 'sky-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
})
export class SkyRowComponent {
  /**
   * Indicates whether to reverse the display order for columns in the row.
   * @default false
   */
  @Input()
  public set reverseColumnOrder(value: boolean | undefined) {
    this.#_reverseColumnOrder = value ?? false;
  }

  public get reverseColumnOrder(): boolean {
    return this.#_reverseColumnOrder;
  }

  #_reverseColumnOrder = false;
}

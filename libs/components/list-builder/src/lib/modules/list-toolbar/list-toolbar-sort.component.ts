import { Component, Input } from '@angular/core';

/**
 * Adds a sort dropdown to the list toolbar.
 * @deprecated
 */
@Component({
  selector: 'sky-list-toolbar-sort',
  template: '',
  standalone: false,
})
export class SkyListToolbarSortComponent {
  /**
   * The label for a sort option.
   * @required
   */
  @Input()
  public label: string;
  /**
   * The data field to sort the list on.
   * @required
   */
  @Input()
  public field: string;
  /**
   * The data type of the data field to sort the list on.
   * @required
   */
  @Input()
  public type: string;
  /**
   * Whether to sort data in descending order.
   * @default false
   */
  @Input()
  public descending: boolean;
}

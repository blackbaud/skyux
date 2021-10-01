import { Component, Input } from '@angular/core';

  /**
   * Adds a sort dropdown to the list toolbar.
   */
  @Component({
    selector: 'sky-list-toolbar-sort',
      template: ''
  })
  export class SkyListToolbarSortComponent {
    /**
     * Specifies a label for a sort option.
     * @required
     */
    @Input()
    public label: string;
    /**
     * Specifies the data field to sort the list on.
     * @required
     */
    @Input()
    public field: string;
    /**
     * Specifies the data type of the data field to sort the list on.
     * @required
     */
    @Input()
    public type: string;
    /**
     * Indicates whether to sort data in descending order.
     * @default false
     */
    @Input()
    public descending: boolean;

 }

import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { ListStateDispatcher } from '../list/state/list-state.rxstate';
import { ListToolbarItemModel } from '../list/state/toolbar/toolbar-item.model';

/**
 * Contains a filter button for the list toolbar. Place a
 * [`sky-filter-button`](https://developer.blackbaud.com/skyux/components/filter)
 * component inside this component to open a modal with filtering options.
 * To apply filter options, use the
 * [list component's](https://developer.blackbaud.com/skyux/components/list/overview#list-properties)
 * `appliedFilters` property.
 */
@Component({
  selector: 'sky-list-filter-button',
  templateUrl: './list-filter-button.component.html',
})
export class SkyListFilterButtonComponent implements AfterViewInit {
  @ViewChild('filterButton', {
    read: TemplateRef,
    static: true,
  })
  private filterButtonTemplate: TemplateRef<any>;

  private filterButtonItemToolbarIndex = 5000;

  constructor(private dispatcher: ListStateDispatcher) {}

  public ngAfterViewInit() {
    this.dispatcher.toolbarAddItems([
      new ListToolbarItemModel({
        template: this.filterButtonTemplate,
        location: 'left',
        index: this.filterButtonItemToolbarIndex,
      }),
    ]);
  }
}

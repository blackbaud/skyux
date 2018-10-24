import { Component, ViewChild } from '@angular/core';
import { SkyListViewGridComponent } from '../list-view-grid.component';
import { ListItemModel } from '@skyux/list-builder/modules/list/state/items/item.model';

@Component({
  selector: 'sky-test-cmp',
  template: require('./list-view-grid-display.component.fixture.html')
})
export class ListViewGridDisplayTestComponent {
  public displayedColumns: Array<string> = ['column3', 'column4'];
  @ViewChild(SkyListViewGridComponent)
  public grid: SkyListViewGridComponent;

  public itemSearch(item: ListItemModel, searchText: string) {
    return false;
  }
}

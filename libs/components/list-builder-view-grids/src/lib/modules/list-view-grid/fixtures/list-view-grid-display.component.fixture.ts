import { Component, ViewChild } from '@angular/core';
import { ListItemModel } from '@skyux/list-builder-common';

import { SkyListViewGridComponent } from '../list-view-grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-grid-display.component.fixture.html',
})
export class ListViewGridDisplayTestComponent {
  public displayedColumns: Array<string> = ['column3', 'column4'];
  @ViewChild(SkyListViewGridComponent)
  public grid: SkyListViewGridComponent;

  public itemSearch(item: ListItemModel, searchText: string) {
    return false;
  }
}

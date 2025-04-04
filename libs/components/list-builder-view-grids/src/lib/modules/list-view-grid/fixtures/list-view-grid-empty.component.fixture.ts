import { Component, ViewChild } from '@angular/core';

import { SkyListViewGridComponent } from '../list-view-grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-grid-empty.component.fixture.html',
  standalone: false,
})
export class ListViewGridEmptyTestComponent {
  @ViewChild(SkyListViewGridComponent)
  public grid: SkyListViewGridComponent;
}

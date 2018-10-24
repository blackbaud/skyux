import { Component, ViewChild } from '@angular/core';
import { SkyListViewGridComponent } from '../list-view-grid.component';

@Component({
  selector: 'sky-test-cmp',
  template: require('./list-view-grid-empty.component.fixture.html')
})
export class ListViewGridEmptyTestComponent {
  @ViewChild(SkyListViewGridComponent)
  public grid: SkyListViewGridComponent;
}

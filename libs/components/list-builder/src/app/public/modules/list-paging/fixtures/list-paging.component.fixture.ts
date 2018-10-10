import { Component, ViewChild } from '@angular/core';
import { SkyListPagingComponent } from '../list-paging.component';

@Component({
  selector: 'sky-test-cmp',
  template: require('./list-paging.component.fixture.html')
})
export class ListPagingTestComponent {
  @ViewChild(SkyListPagingComponent)
  public pagingComponent: SkyListPagingComponent;
}

import { Component, ViewChild } from '@angular/core';
import { SkyListPagingComponent } from '../list-paging.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-paging.component.fixture.html',
})
export class ListPagingTestComponent {
  @ViewChild(SkyListPagingComponent, {
    read: SkyListPagingComponent,
    static: true,
  })
  public pagingComponent: SkyListPagingComponent;
}

import { Component, ViewChild, input } from '@angular/core';

import { SkyPagingComponent } from '../paging.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './paging.component.fixture.html',
  standalone: false,
})
export class SkyPagingTestComponent {
  @ViewChild(SkyPagingComponent, {
    read: SkyPagingComponent,
    static: true,
  })
  public pagingComponent!: SkyPagingComponent;

  public pageSize = input<number>(2);
  public maxPages = input<number>(3);
  public currentPage = input<number>(1);
  public itemCount = input<number>(8);
  public label = input<string | undefined>(undefined);
}

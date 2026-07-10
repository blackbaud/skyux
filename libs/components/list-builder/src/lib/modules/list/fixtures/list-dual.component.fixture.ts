import { Component, inject, ViewChild } from '@angular/core';

import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-dual.component.fixture.html',
  standalone: false,
})
export class ListDualTestComponent {
  @ViewChild(SkyListComponent, {
    read: SkyListComponent,
    static: true,
  })
  public list: SkyListComponent;

  public readonly items: any = inject('items' as any);
}

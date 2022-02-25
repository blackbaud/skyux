import { Component, ViewChild, Inject } from '@angular/core';
import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-dual.component.fixture.html',
})
export class ListDualTestComponent {
  @ViewChild(SkyListComponent, {
    read: SkyListComponent,
    static: true,
  })
  public list: SkyListComponent;

  constructor(@Inject('items') public items: any) {}
}

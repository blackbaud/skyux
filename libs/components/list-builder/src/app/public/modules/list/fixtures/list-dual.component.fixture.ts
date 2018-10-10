import { Component, ViewChild, Inject } from '@angular/core';
import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  template: require('./list-dual.component.fixture.html')
})
export class ListDualTestComponent {
  @ViewChild(SkyListComponent) public list: SkyListComponent;

  constructor(@Inject('items') public items: any) {
  }
}

import { Component, ViewChild, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyListToolbarComponent } from '../../list-toolbar/list-toolbar.component';

import { SkyListComponent } from '../list.component';
import { ListViewComponent } from '../list-view.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list.component.fixture.html',
})
export class ListTestComponent {
  @ViewChild(SkyListComponent, {
    read: SkyListComponent,
    static: true,
  })
  public list: SkyListComponent;

  @ViewChild('toolbar', {
    read: SkyListToolbarComponent,
    static: true,
  })
  public toolbar: SkyListToolbarComponent;

  public default: ListViewComponent;
  public sortFields: any;

  constructor(@Inject('items') public items: any) {}

  public get options() {
    let bs = new BehaviorSubject<Array<any>>(['banana', 'apple']);
    return bs.asObservable();
  }
}

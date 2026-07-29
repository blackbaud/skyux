import { Component, inject, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyListToolbarComponent } from '../../list-toolbar/list-toolbar.component';
import { ListViewComponent } from '../list-view.component';
import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list.component.fixture.html',
  standalone: false,
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

  public readonly items: any = inject('items' as any);

  public get options() {
    const bs = new BehaviorSubject<any[]>(['banana', 'apple']);
    return bs.asObservable();
  }
}

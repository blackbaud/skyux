import { Component, inject, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyListInMemoryDataProvider } from '../../list-data-provider-in-memory/list-data-in-memory.provider';
import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-empty.component.fixture.html',
  standalone: false,
})
export class ListEmptyTestComponent {
  @ViewChild(SkyListComponent, {
    read: SkyListComponent,
    static: true,
  })
  public list: SkyListComponent;

  public itemsCount = 2;

  public readonly items: any = inject('items' as any);
  public readonly dataProvider = inject(SkyListInMemoryDataProvider);

  public get options() {
    const bs = new BehaviorSubject<any[]>(['banana', 'apple']);
    return bs.asObservable();
  }
}

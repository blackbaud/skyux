import { Component, Inject, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyListInMemoryDataProvider } from '../../list-data-provider-in-memory/list-data-in-memory.provider';
import { SkyListComponent } from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-empty.component.fixture.html',
})
export class ListEmptyTestComponent {
  @ViewChild(SkyListComponent, {
    read: SkyListComponent,
    static: true,
  })
  public list: SkyListComponent;

  public itemsCount = 2;

  constructor(
    @Inject('items') public items: any,
    public dataProvider: SkyListInMemoryDataProvider
  ) {}

  public get options() {
    const bs = new BehaviorSubject<Array<any>>(['banana', 'apple']);
    return bs.asObservable();
  }
}

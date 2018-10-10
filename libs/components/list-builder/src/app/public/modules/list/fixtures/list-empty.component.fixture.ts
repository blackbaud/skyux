import { Component, ViewChild, Inject } from '@angular/core';
import { SkyListComponent } from '../list.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyListInMemoryDataProvider } from '../../list-data-provider-in-memory';

@Component({
  selector: 'sky-test-cmp',
  template: require('./list-empty.component.fixture.html')
})
export class ListEmptyTestComponent {
  @ViewChild(SkyListComponent) public list: SkyListComponent;
  public itemsCount: number = 2;

  constructor(
    @Inject('items') public items: any,
    public dataProvider: SkyListInMemoryDataProvider
  ) {
  }

  public get options() {
    let bs = new BehaviorSubject<Array<any>>(['banana', 'apple']);
    return bs.asObservable();
  }
}

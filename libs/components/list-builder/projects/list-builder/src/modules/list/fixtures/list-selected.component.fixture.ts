import {
  Component,
  Inject,
  ViewChild
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyListComponent
} from '../list.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-selected.component.fixture.html'
})
export class ListSelectedTestComponent {

  @ViewChild(SkyListComponent, {
    read: SkyListComponent,
    static: true
  })
  public list: SkyListComponent;

  public selectedItems: Map<string, boolean>;

  public selectedIds: Array<string> | BehaviorSubject<Array<string>> = ['1', '2'];

  constructor(@Inject('items') public items: any) {
  }

  public selectedChangeFunction(selectedItems: Map<string, boolean>) {
    this.selectedItems = selectedItems;
  }

}

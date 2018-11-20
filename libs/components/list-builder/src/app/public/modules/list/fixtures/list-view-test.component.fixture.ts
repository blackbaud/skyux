//#region imports

import {
  Component,
  Input,
  forwardRef
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListState,
  ListStateDispatcher
} from '../state';

import {
  ListViewComponent
} from '../list-view.component';

//#endregion

@Component({
  selector: 'sky-list-view-test',
  templateUrl: './list-view-test.component.fixture.html',
  providers: [
    /* tslint:disable-next-line */
    { provide: ListViewComponent, useExisting: forwardRef(() => ListViewTestComponent) },
  ]
})
export class ListViewTestComponent extends ListViewComponent {

  public currentSearchText: Observable<string>;

  @Input()
  public search: (data: any, searchText: string) => boolean = this.searchFunction();

  @Input()
  public set name(value: string) {
    this.viewName = value;
  }

  public items: ListItemModel[];

  constructor(
    state: ListState,
    private dispatcher: ListStateDispatcher
  ) {
    super(state, 'Test View');

    state.map(s => s.items)
      .distinctUntilChanged()
      .subscribe((items) => {
        this.items = items.items;
      });
  }

  public searchFunction() {
    return (data: any, searchText: string) => {
      for (const p in data) {
        if (data[p] && data[p].toString().toLowerCase().indexOf(searchText) >= 0) {
          return true;
        }
      }

      return false;
    };
  }

  public onViewActive() {
    if (this.search !== undefined) {
      this.dispatcher.searchSetFunctions([this.search]);
    }
  }

}

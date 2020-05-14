import {
  Component,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  OnInit
} from '@angular/core';

import {
  AsyncList,
  getValue,
  ListItemModel
} from '@skyux/list-builder-common';

import {
  Observable
} from 'rxjs';

import {
  distinctUntilChanged,
  map as observableMap,
  scan
} from 'rxjs/operators';

import { ListPagingComponent } from '../list/list-paging.component';
import { ListState } from '../list/state/list-state.state-node';
import { ListStateDispatcher } from '../list/state/list-state.rxstate';
import {
  ListPagingSetMaxPagesAction
} from '../list/state/paging/set-max-pages.action';

import {
  ListPagingSetItemsPerPageAction
} from '../list/state/paging/set-items-per-page.action';

import {
  ListPagingSetPageNumberAction
} from '../list/state/paging/set-page-number.action';

@Component({
  selector: 'sky-list-paging',
  templateUrl: './list-paging.component.html',
  providers: [
    /* tslint:disable */
    { provide: ListPagingComponent, useExisting: forwardRef(() => SkyListPagingComponent)}
    /* tslint:enable */
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListPagingComponent extends ListPagingComponent implements OnInit {
  @Input()
  public pageSize: Observable<number> | number = 10;

  @Input()
  public maxPages: Observable<number> | number = 5;

  @Input()
  public pageNumber: Observable<number> | number = 1;

  public currentPageNumber: Observable<number>;

  public maxDisplayedPages: Observable<number>;

  public itemsPerPage: Observable<number>;

  public itemCount: Observable<number>;

  constructor(
    state: ListState,
    dispatcher: ListStateDispatcher
  ) {
    super(state, dispatcher);
  }

  public ngOnInit() {

    this.currentPageNumber = this.state.pipe(observableMap(s => s.paging.pageNumber));

    this.maxDisplayedPages = this.state.pipe(observableMap(s => s.paging.maxDisplayedPages));

    this.itemsPerPage = this.state.pipe(observableMap(s => s.paging.itemsPerPage));

    this.itemCount = this.state
      .pipe(
        observableMap((s) => {
          return s.items;
        }),
        scan((previousValue: AsyncList<ListItemModel>, newValue: AsyncList<ListItemModel>) => {
          if (previousValue.lastUpdate > newValue.lastUpdate) {
            return previousValue;
          } else {
            return newValue;
          }
        }),
        observableMap((result: AsyncList<ListItemModel>) => {
          return result.count;
        }),
        distinctUntilChanged()
      );

    // subscribe to or use inputs
    getValue(this.pageSize, (pageSize: number) =>
      this.dispatcher.next(
        new ListPagingSetItemsPerPageAction(Number(pageSize))
      )
    );
    getValue(this.maxPages, (maxPages: number) =>
      this.dispatcher.next(
        new ListPagingSetMaxPagesAction(Number(maxPages))
      )
    );
    getValue(this.pageNumber, (pageNumber: number) =>
      this.dispatcher.next(
        new ListPagingSetPageNumberAction(Number(pageNumber))
      ));
  }

  public pageChange(currentPage: number) {
    // Paging must be updated after list data has been updated.
    // Adding a setTimeout will pull it out of the stream.
    setTimeout(() => {
      this.dispatcher.next(
        new ListPagingSetPageNumberAction(Number(currentPage))
      );
    });
  }

}

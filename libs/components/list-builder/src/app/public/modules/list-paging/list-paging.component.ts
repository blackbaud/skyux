import {
  Component,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  OnInit
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  AsyncList
} from 'microedge-rxstate/dist';

import {
  getValue
} from 'microedge-rxstate/dist/helpers';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/operator/distinctUntilChanged';

import 'rxjs/add/operator/scan';

import { ListPagingComponent } from '../list/list-paging.component';
import { ListState, ListStateDispatcher } from '../list/state';
import {
  ListPagingSetMaxPagesAction,
  ListPagingSetItemsPerPageAction,
  ListPagingSetPageNumberAction
} from '../list/state/paging/actions';

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

    this.currentPageNumber = this.state.map(s => s.paging.pageNumber);

    this.maxDisplayedPages = this.state.map(s => s.paging.maxDisplayedPages);

    this.itemsPerPage = this.state.map(s => s.paging.itemsPerPage);

    this.itemCount = this.state.map((s) => {
      return s.items;
    })
    .scan((previousValue: AsyncList<ListItemModel>, newValue: AsyncList<ListItemModel>) => {
      if (previousValue.lastUpdate > newValue.lastUpdate) {
        return previousValue;
      } else {
        return newValue;
      }
    })
    .map((result: AsyncList<ListItemModel>) => {
      return result.count;
    })
    .distinctUntilChanged();

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

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  forwardRef,
} from '@angular/core';
import { AsyncList, ListItemModel, getValue } from '@skyux/list-builder-common';

import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  map as observableMap,
  scan,
} from 'rxjs/operators';

import { ListPagingComponent } from '../list/list-paging.component';
import { ListStateDispatcher } from '../list/state/list-state.rxstate';
import { ListState } from '../list/state/list-state.state-node';
import { ListPagingSetItemsPerPageAction } from '../list/state/paging/set-items-per-page.action';
import { ListPagingSetMaxPagesAction } from '../list/state/paging/set-max-pages.action';
import { ListPagingSetPageNumberAction } from '../list/state/paging/set-page-number.action';

/* istanbul ignore next */
const listPagingComponentRef = forwardRef(() => SkyListPagingComponent);

/**
 * Displays a pagination control for a SKY UX-themed list of data.
 */
@Component({
  selector: 'sky-list-paging',
  templateUrl: './list-paging.component.html',
  providers: [
    { provide: ListPagingComponent, useExisting: listPagingComponentRef },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyListPagingComponent
  extends ListPagingComponent
  implements OnInit
{
  /**
   * Specifies the number of list items per page.
   * @default 10
   */
  @Input()
  public pageSize: Observable<number> | number = 10;

  /**
   * Specifies the maximum pages to display.
   * @default 5
   */
  @Input()
  public maxPages: Observable<number> | number = 5;

  /**
   * Specifies the current page number.
   * @default 1
   */
  @Input()
  public pageNumber: Observable<number> | number = 1;

  public currentPageNumber: Observable<number>;

  public maxDisplayedPages: Observable<number>;

  public itemsPerPage: Observable<number>;

  public itemCount: Observable<number>;

  constructor(state: ListState, dispatcher: ListStateDispatcher) {
    super(state, dispatcher);
  }

  public ngOnInit() {
    this.currentPageNumber = this.state.pipe(
      observableMap((s) => s.paging.pageNumber)
    );

    this.maxDisplayedPages = this.state.pipe(
      observableMap((s) => s.paging.maxDisplayedPages)
    );

    this.itemsPerPage = this.state.pipe(
      observableMap((s) => s.paging.itemsPerPage)
    );

    this.itemCount = this.state.pipe(
      observableMap((s) => {
        return s.items;
      }),
      scan(
        (
          previousValue: AsyncList<ListItemModel>,
          newValue: AsyncList<ListItemModel>
        ) => {
          if (previousValue.lastUpdate > newValue.lastUpdate) {
            return previousValue;
          } else {
            return newValue;
          }
        }
      ),
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
      this.dispatcher.next(new ListPagingSetMaxPagesAction(Number(maxPages)))
    );
    getValue(this.pageNumber, (pageNumber: number) =>
      this.dispatcher.next(
        new ListPagingSetPageNumberAction(Number(pageNumber))
      )
    );
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

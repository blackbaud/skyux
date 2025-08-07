import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyPagingContentChangeArgs } from './types/paging-content-change-args';

@Component({
  selector: 'sky-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyPagingComponent implements OnChanges {
  /**
   * The page number of the current page. Page numbers start at 1 and increment.
   */
  @Input()
  public currentPage = 1;

  /**
   * The total number of items across all pages.
   */
  @Input()
  public itemCount = 0;

  /**
   * The maximum number of pages to display in the pagination control.
   */
  @Input()
  public maxPages = 5;

  /**
   * The number of items to display per page.
   */
  @Input()
  public pageSize = 10;

  /**
   * The label for the pagination control when an application includes
   * multiple paging components on the same page. The label should be unique and descriptive
   * to help users of assistive technology differentiate pagination controls
   * and understand what each one does.
   * @default "Pagination"
   */
  @Input()
  public pagingLabel: string | undefined;

  /**
   * Fires when the current page changes and emits the new current page.
   */
  @Output()
  public currentPageChange = new EventEmitter<number>();

  /**
   * Fires when the current page changes and emits the new current page with a function
   * to call when loading the new page completes. Handling this event will display the
   * wait component until the callback function is called, and focus will move to the top
   * of the list for keyboard navigation if the list contents are placed inside the
   * sky-paging-content element.
   */
  @Output()
  public contentChange = new EventEmitter<SkyPagingContentChangeArgs>();

  @ViewChild('contentWrapper', { read: ElementRef })
  public contentWrapper: ElementRef | undefined;

  public displayedPages: number[] = [];

  public pageCount = 0;

  protected isLoading = new BehaviorSubject(false);

  public ngOnChanges(changes: SimpleChanges): void {
    this.setPage(this.currentPage, changes['currentPage']?.isFirstChange());
  }

  public setPage(pageNumber: number, forceContentChange?: boolean): void {
    const previousPage = this.currentPage;

    this.#setPageCount();

    if (pageNumber < 1 || this.pageCount < 1) {
      this.currentPage = 1;
    } else if (pageNumber > this.pageCount) {
      this.currentPage = this.pageCount;
    } else {
      this.currentPage = pageNumber;
    }

    this.#setDisplayedPages();

    let doContentChange = forceContentChange;

    if (previousPage !== this.currentPage) {
      this.currentPageChange.emit(this.currentPage);
      doContentChange = true;
    }

    if (doContentChange && this.contentChange.observed) {
      this.#moveFocusToTop();
      this.isLoading.next(true);

      this.contentChange.emit({
        currentPage: this.currentPage,
        loadingComplete: () => this.isLoading.next(false),
      });
    }
  }

  public nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  public previousPage(): void {
    this.setPage(this.currentPage - 1);
  }

  public get isPreviousButtonDisabled(): boolean {
    return this.currentPage === 1;
  }

  public get isNextButtonDisabled(): boolean {
    return this.currentPage === this.pageCount;
  }

  #getDisplayedPageNumbers(
    pageCount: number,
    maxDisplayedPages: number,
    pageNumber: number,
  ): number[] {
    const pageIndex = pageNumber - 1;
    const pageBounds = Math.floor(maxDisplayedPages / 2);

    let upperBound = pageIndex + pageBounds;
    let lowerBound = pageIndex - pageBounds;
    if (maxDisplayedPages % 2 !== 0) {
      upperBound += 1;
    }

    // Wrap negative values to increase the upper bound
    if (lowerBound < 0) {
      upperBound -= lowerBound;
      lowerBound = 0;
    }
    // Wrap overflow to decrease the lower bound
    if (upperBound > pageCount) {
      lowerBound -= upperBound - pageCount;
      upperBound = pageCount;
    }

    // If both are the same ignore everything else and just display it all
    if (pageCount < maxDisplayedPages) {
      lowerBound = 0;
      upperBound = pageCount;
    }

    const displayedPageNumbers: number[] = [];
    for (let i = lowerBound; i < upperBound; i++) {
      displayedPageNumbers.push(i + 1);
    }
    return displayedPageNumbers;
  }

  #setPageCount(): void {
    if (this.itemCount === 0 || this.pageSize === 0) {
      this.pageCount = 0;
      return;
    }

    this.pageCount = Math.ceil(this.itemCount / this.pageSize);
  }

  #setDisplayedPages(): void {
    this.displayedPages = this.#getDisplayedPageNumbers(
      this.pageCount,
      this.maxPages,
      this.currentPage,
    );
  }

  #moveFocusToTop(): void {
    this.contentWrapper?.nativeElement.focus();
  }
}

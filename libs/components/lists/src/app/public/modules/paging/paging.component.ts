import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'sky-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyPagingComponent implements OnChanges {
  @Input()
  public pageSize: number = 10;

  @Input()
  public maxPages: number = 5;

  @Input()
  public currentPage: number = 1;

  @Input()
  public itemCount: number = 0;

  @Input()
  public pagingLabel: string;

  @Output()
  public currentPageChange: EventEmitter<number> = new EventEmitter<number>();

  public displayedPages: Array<number> = [];
  public pageCount: number = 0;

  public ngOnChanges(changes: SimpleChanges) {
    this.setPage(this.currentPage);
  }

  public setPage(pageNumber: number): void {
    let previousPage = this.currentPage;

    this.setPageCount();

    if (pageNumber < 1 || this.pageCount < 1) {
      this.currentPage = 1;
    } else if (pageNumber > this.pageCount) {
      this.currentPage = this.pageCount;
    } else {
      this.currentPage = pageNumber;
    }

    this.setDisplayedPages();

    if (previousPage !== this.currentPage) {
      this.currentPageChange.emit(this.currentPage);
    }

  }

  public nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  public previousPage(): void {
    this.setPage(this.currentPage - 1);
  }

  public get isPreviousButtonDisabled(): boolean {
    return (this.currentPage === 1);
  }

  public get isNextButtonDisabled(): boolean {
    return (this.currentPage === this.pageCount);
  }

  private getDisplayedPageNumbers(
    pageCount: number,
    maxDisplayedPages: number,
    pageNumber: number
  ): Array<number> {
    let pageIndex = pageNumber - 1;
    let pageBounds = Math.floor(maxDisplayedPages / 2);

    let upperBound = pageIndex + pageBounds;
    let lowerBound = pageIndex - pageBounds;
    if (maxDisplayedPages % 2 !== 0) {
      upperBound += 1;
    }

    // Wrap negative values to increase the upperbound
    if (lowerBound < 0) {
      upperBound -= lowerBound;
      lowerBound = 0;
    }
    // Wrap overflow to decrease the lowerbound
    if (upperBound > pageCount) {
      lowerBound -= upperBound - pageCount;
      upperBound = pageCount;
    }

    // If both are the same ignore everything else and just display it all
    if (pageCount < maxDisplayedPages) {
      lowerBound = 0;
      upperBound = pageCount;
    }

    let displayedPageNumbers: Array<number> = [];
    for (let i = lowerBound; i < upperBound; i++) {
      displayedPageNumbers.push(i + 1);
    }
    return displayedPageNumbers;
  }

  private setPageCount() {
    if (this.itemCount === 0 || this.pageSize === 0) {
      this.pageCount = 0;
      return;
    }

    this.pageCount = Math.ceil(this.itemCount / this.pageSize);

  }

  private setDisplayedPages() {

    this.displayedPages =
      this.getDisplayedPageNumbers(this.pageCount, this.maxPages, this.currentPage);
  }
}

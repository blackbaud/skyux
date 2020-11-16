import {
  Component
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyPagingFixture
} from './paging-fixture';

import {
  SkyPagingFixtureButton
} from './paging-fixture-button';

import {
  SkyPagingTestingModule
} from './paging-testing.module';

const DATA_SKY_ID = 'test-paging';

//#region Test component
@Component({
  selector: 'paging-test',
  template: `
  <sky-paging
    data-sky-id="${DATA_SKY_ID}"
    [(currentPage)]="currentPage"
    [itemCount]="itemCount"
    [maxPages]="maxPages"
    [pagingLabel]="pageLabel"
    [pageSize]="pageSize"
    (currentPageChange)="currentPageChange($event)"
  >
  </sky-paging>
  <p>
    The current page is {{currentPage}}.
  </p>
`
})
class PhoneFieldTestComponent {
  public currentPage: number = 1;
  public itemCount: number = 8;
  public maxPages: number = 3; // only show 3 pages in pager
  public pageLabel: string;
  public pageSize: number = 2; // 4 total pages

  public currentPageChange(currentPage: number): void { }
}
//#endregion Test component

describe('Paging fixture', () => {
  let fixture: ComponentFixture<PhoneFieldTestComponent>;
  let testComponent: PhoneFieldTestComponent;
  let pagingFixture: SkyPagingFixture;

  //#region helpers

  function getLastPage() {
    return Math.ceil(testComponent.itemCount / testComponent.pageSize);
  }

  function verifyActivePageLink(
    pages: SkyPagingFixtureButton[],
    expectedActivePageId: string | number
  ) {
    pages.forEach((page: SkyPagingFixtureButton) => {
      const shouldBeActive = page.id === expectedActivePageId.toString();

      expect(page.isActive).toBe(shouldBeActive);
      expect(page.isEnabled).toBe(!shouldBeActive);
    });
  }

  function verifyPagingState(expectedActivePageId: number) {
    const pages = pagingFixture.pageLinks;

    // active page should be accurate
    expect(pagingFixture.activePageId).toBe(expectedActivePageId.toString());

    // page count should never be higher than the max
    expect(pagingFixture.pageLinks.length).toBeLessThanOrEqual(testComponent.maxPages);

    // the page links should reflect the active page state
    verifyActivePageLink(pages, expectedActivePageId);
  }

  //#endregion helpers

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        PhoneFieldTestComponent
      ],
      imports: [
        SkyPagingTestingModule
      ]
    });

    fixture = TestBed.createComponent(
      PhoneFieldTestComponent
    );
    testComponent = fixture.componentInstance;
    pagingFixture = new SkyPagingFixture(fixture, DATA_SKY_ID);
  });

  it('should reflect default properties', () => {
    // verify active page
    expect(pagingFixture.activePageId).toBe(testComponent.currentPage.toString());

    // verify page list
    const pages = pagingFixture.pageLinks;
    expect(pages.length).toBe(testComponent.maxPages);
    verifyActivePageLink(pages, testComponent.currentPage);
  });

  it('should reflect modified properties', async () => {
    // override defaults
    testComponent.itemCount = 12;
    testComponent.maxPages = 2; // only show 2 pages in pager
    testComponent.pageSize = 3; // 4 total pages
    testComponent.currentPage = 2;
    fixture.detectChanges();
    await fixture.whenStable();

    // verify active page
    expect(pagingFixture.activePageId).toBe(testComponent.currentPage.toString());

    // verify page list
    const pages = pagingFixture.pageLinks;
    expect(pages.length).toBe(testComponent.maxPages);
    verifyActivePageLink(pages, testComponent.currentPage);
  });

  it('should handle missing paging controls due to zero items', async () => {
    // override defaults
    testComponent.itemCount = 0;
    fixture.detectChanges();
    await fixture.whenStable();

    // verify active page
    expect(pagingFixture.activePageId).toBeUndefined();

    // verify page list
    expect(pagingFixture.pageLinks.length).toBe(0);
    expect(pagingFixture.activePageId).toBeUndefined();

    // actions should not fail
    await pagingFixture.selectNextPage();
    await pagingFixture.selectPreviousPage();
    await pagingFixture.selectPage(1);
  });

  it('should select page if it is available', async () => {
    const currentPageChangeSpy = spyOn(fixture.componentInstance, 'currentPageChange');
    const targetPage = 2;

    // ensure we have a second page to select and we're not on that page already
    expect(pagingFixture.activePageId).toBe('1');
    expect(pagingFixture.pageLinks).toContain(jasmine.objectContaining({ id: `${targetPage}` }));

    // select the target page
    await pagingFixture.selectPage(targetPage);

    // verify the event was fired and the current page matches our action
    expect(currentPageChangeSpy).toHaveBeenCalledWith(targetPage);
    expect(testComponent.currentPage).toBe(targetPage);

    // verify paging state
    verifyPagingState(targetPage);
  });

  it('should do nothing when selecting the active page', async () => {
    const currentPageChangeSpy = spyOn(fixture.componentInstance, 'currentPageChange');

    // ensure we have an active page
    const originalPage = testComponent.currentPage;
    expect(originalPage).toBe(1);

    // select the active page
    await pagingFixture.selectPage(originalPage);

    // verify the event was not fired and the current page remains the same
    expect(currentPageChangeSpy).toHaveBeenCalledTimes(0);
    expect(testComponent.currentPage).toBe(originalPage);

    // verify paging state
    verifyPagingState(originalPage);
  });

  it('should do nothing when selecting non existent page', async () => {
    const currentPageChangeSpy = spyOn(fixture.componentInstance, 'currentPageChange');

    // ensure we have an active page
    const originalPage = testComponent.currentPage;
    expect(originalPage).toBe(1);

    // select an out of range page
    await pagingFixture.selectPage(999);

    // verify the event was not fired and the current page remains the same
    expect(currentPageChangeSpy).toHaveBeenCalledTimes(0);
    expect(testComponent.currentPage).toBe(originalPage);

    // verify paging state
    verifyPagingState(originalPage);
  });

  it('should transition to the next page when one is available', async () => {
    const currentPageChangeSpy = spyOn(fixture.componentInstance, 'currentPageChange');

    // ensure we have an active page with a next page available
    const originalPage = testComponent.currentPage;
    const nextPage = originalPage + 1;
    expect(originalPage).toBe(1);
    expect(pagingFixture.pageLinks).toContain(jasmine.objectContaining({ id: `${nextPage}` }));

    // move to the next page
    await pagingFixture.selectNextPage();

    // verify the event was fired and the current page matches our action
    expect(currentPageChangeSpy).toHaveBeenCalledWith(nextPage);
    expect(testComponent.currentPage).toBe(nextPage);

    // verify paging state
    verifyPagingState(nextPage);
  });

  it('should do nothing when selecting the next page from the last pge', async () => {
    const currentPageChangeSpy = spyOn(fixture.componentInstance, 'currentPageChange');

    // move to the last page
    const lastPage = getLastPage();
    testComponent.currentPage = lastPage;
    fixture.detectChanges();
    await fixture.whenStable();

    // ensure we have an active page with no next page available
    expect(testComponent.currentPage).toBe(lastPage);

    // try to move to the next page
    await pagingFixture.selectNextPage();

    // verify the event was not fired and the current page remains the same
    expect(currentPageChangeSpy).toHaveBeenCalledTimes(0);
    expect(testComponent.currentPage).toBe(lastPage);

    // verify paging state
    verifyPagingState(lastPage);
  });

  it('should transition to the previous page when one is available', async () => {
    const currentPageChangeSpy = spyOn(fixture.componentInstance, 'currentPageChange');

    // move to the last page
    const lastPage = getLastPage();
    testComponent.currentPage = lastPage;
    fixture.detectChanges();
    await fixture.whenStable();

    // ensure we have an active page with a previous page available
    const previousPage = lastPage - 1;
    expect(testComponent.currentPage).toBe(lastPage);
    expect(pagingFixture.pageLinks).toContain(jasmine.objectContaining({ id: `${previousPage}` }));

    // move to the previous page
    await pagingFixture.selectPreviousPage();

    // verify the event was fired and the current page matches our action
    expect(currentPageChangeSpy).toHaveBeenCalledWith(previousPage);
    expect(testComponent.currentPage).toBe(previousPage);

    // verify paging state
    verifyPagingState(previousPage);
  });

  it('should do nothing when selecting the previous page from the first page', async () => {
    const currentPageChangeSpy = spyOn(fixture.componentInstance, 'currentPageChange');

    // ensure we have an active page with no previous page available
    const originalPage = testComponent.currentPage;
    expect(originalPage).toBe(1);

    // try to move to the previous page
    await pagingFixture.selectPreviousPage();

    // verify the event was not fired and the current page remains the same
    expect(currentPageChangeSpy).toHaveBeenCalledTimes(0);
    expect(testComponent.currentPage).toBe(originalPage);

    // verify paging state
    verifyPagingState(originalPage);
  });
});

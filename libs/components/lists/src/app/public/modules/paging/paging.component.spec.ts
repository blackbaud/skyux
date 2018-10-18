import {
  TestBed, async
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing';

import {
  PagingTestComponent
} from './fixtures/paging.component.fixture';

import {
  SkyPagingModule
} from './paging.module';

import {
  expect
} from '@skyux-sdk/testing';

describe('Paging component', () => {
  let component: PagingTestComponent,
      fixture: any,
      element: DebugElement;
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        PagingTestComponent
      ],
      imports: [
        SkyPagingModule
      ],
      providers: [
        {
          provide: SkyLibResourcesService,
          useClass: SkyLibResourcesTestService
        }
      ]
    });

    fixture = TestBed.createComponent(PagingTestComponent);
    element = fixture.debugElement as DebugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  function getPagingSelector(type: string) {
    if (type === 'next' || type === 'previous') {
      return '.sky-paging-btn[sky-cmp-id="' + type + '"]';
    } else {
      return '.sky-list-paging-link button[sky-cmp-id="' + type + '"]';
    }
  }

  function verifyDisabled(elem: DebugElement) {
    expect(elem.nativeElement.disabled).toBeTruthy();
  }

  function verifyEnabled(elem: DebugElement) {
    expect(elem.nativeElement.disabled).toBeFalsy();
  }

  describe('with 8 items', () => {

    it('should show 3 pages', () => {
      expect(element.queryAll(By.css('.sky-list-paging-link')).length).toBe(3);
    });

    it('should have a disabled previous button', () => {
      let elem = element.query(By.css(getPagingSelector('previous')));
      verifyDisabled(elem);
    });

    it('should have an enabled next button', () => {
      let elem = element.query(By.css(getPagingSelector('next')));
      verifyEnabled(elem);
    });

    it('should show selected page 1 with special style', () => {
      expect(element.query(
        By.css(getPagingSelector('1'))
      ).nativeElement.classList.contains('sky-paging-current')).toBe(true);
    });

    it('should not let you change page number to 5', () => {
      component.pagingComponent.setPage(5);
      fixture.detectChanges();

      expect(element.query(
        By.css(getPagingSelector('1'))
      ).nativeElement.classList.contains('sky-paging-current')).toBe(true);
    });

    it('should not let you set page number to 0', () => {
      component.pagingComponent.setPage(0);
      fixture.detectChanges();

      expect(element.query(
        By.css(getPagingSelector('1'))
      ).nativeElement.classList.contains('sky-paging-current')).toBe(true);
    });

    describe('after clicking page 3', () => {
      beforeEach(() => {
        element.query(
          By.css(getPagingSelector('3'))
        ).triggerEventHandler('click', undefined);
        fixture.detectChanges();
      });

      it('should have an enabled previous button', () => {
        let elem = element.query(By.css(getPagingSelector('previous')));
        verifyEnabled(elem);
      });

      it('should have an enabled next button', () => {
        let elem = element.query(By.css(getPagingSelector('next')));
        verifyEnabled(elem);
      });

      it('should show selected page 3 with special style', () => {
        expect(element.query(
          By.css(getPagingSelector('3'))
        ).nativeElement.classList.contains('sky-paging-current')).toBe(true);
      });

      it('should not show page 1', () => {
        expect(element.query(
          By.css(getPagingSelector('1'))
        )).toBeNull();
      });

      it('should show page 4', () => {
        expect(element.query(
          By.css(getPagingSelector('4'))
        )).not.toBeNull();
      });

      describe('and clicking next', () => {
        beforeEach(() => {
          element.query(By.css(getPagingSelector('next')))
            .triggerEventHandler('click', undefined);
          fixture.detectChanges();
        });

        it('should have enabled previous button', () => {
          let elem = element.query(By.css(getPagingSelector('previous')));
          verifyEnabled(elem);
        });

        it('should have disabled next button', () => {
          let elem = element.query(By.css(getPagingSelector('next')));
          verifyDisabled(elem);
        });
      });

      describe('and clicking previous twice', () => {
        beforeEach(() => {
          element.query(
            By.css(getPagingSelector('previous'))
          ).triggerEventHandler('click', undefined);
          element.query(
            By.css(getPagingSelector('previous'))
          ).triggerEventHandler('click', undefined);
          fixture.detectChanges();
        });

        it('should have disabled previous button', () => {
          let elem = element.query(By.css(getPagingSelector('previous')));
          verifyDisabled(elem);
        });

        it('should have enabled next button', () => {
          let elem = element.query(By.css(getPagingSelector('next')));
          verifyEnabled(elem);
        });

        it('should show selected page 1 with special style', () => {
           expect(element.query(
            By.css(getPagingSelector('1'))
          ).nativeElement.classList.contains('sky-paging-current')).toBe(true);
        });
      });
    });

    it('should default to last page if pageNumber set over', () => {
      component.currentPage = 12;
      fixture.detectChanges();

      expect(element.queryAll(By.css('.sky-list-paging-link')).length).toBe(3);
    });

    describe('binding changes', () => {
      it('should react properly when currentPage is changed', () => {
        component.currentPage = 2;
        fixture.detectChanges();

        expect(element.query(
          By.css(getPagingSelector('2'))
        ).nativeElement.classList.contains('sky-paging-current')).toBe(true);

        expect(element.query(
          By.css(getPagingSelector('previous'))
        ).nativeElement.disabled).toBeFalsy();

        expect(element.query(
          By.css(getPagingSelector('next'))
        ).nativeElement.disabled).toBeFalsy();

      });

      it('should react properly when itemCount is changed', () => {
        component.itemCount = 3;
        fixture.detectChanges();

        expect(element.query(
          By.css(getPagingSelector('3'))
        )).toBeNull();
      });

      it('should react properly when pageSize is changed', () => {
        component.pageSize = 4;
        fixture.detectChanges();

        expect(element.query(
          By.css(getPagingSelector('3'))
        )).toBeNull();
      });

      it('should react properly when maxPages is changed', () => {
        component.maxPages = 4;
        fixture.detectChanges();

        expect(element.query(
          By.css(getPagingSelector('4'))
        )).not.toBeNull();
      });
    });

    describe('accessibility', () => {
      it('should have a nav role on the parent element with a given aria-label', () => {
        component.label = 'My label';
        fixture.detectChanges();

        let navElement = element.query(
          By.css('ul')
        ).nativeElement;

        expect(navElement.getAttribute('role')).toBe('navigation');

        expect(navElement.getAttribute('aria-label')).toBe('My label');
      });

      it('should have a nav role on the parent element with a default aria-label', () => {

        let navElement = element.query(
          By.css('ul')
        ).nativeElement;

        expect(navElement.getAttribute('aria-label')).toBe('Pagination');
      });

      it('should have aria-label on each of the next and previous buttons',
      () => {
        let prevElement = element.query(
          By.css(getPagingSelector('previous'))
        ).nativeElement;

        expect(prevElement.getAttribute('aria-label')).toBe('Previous');

        let nextElement = element.query(
          By.css(getPagingSelector('next'))
        ).nativeElement;

        expect(nextElement.getAttribute('aria-label')).toBe('Next');
      });

      it('should show the correct pages for an even number of maximum pages', () => {
        let pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 6, 1);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 6, 2);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 6, 4);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 6, 7);
        expect(pageNumbers).toEqual([3, 4, 5, 6, 7, 8]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 6, 8);
        expect(pageNumbers).toEqual([3, 4, 5, 6, 7, 8]);
      });

      it('should show the correct pages for an odd number of maximum pages', () => {
        let pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 5, 1);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 5, 2);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 5, 4);
        expect(pageNumbers).toEqual([2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 5, 7);
        expect(pageNumbers).toEqual([4, 5, 6, 7, 8]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(8, 5, 8);
        expect(pageNumbers).toEqual([4, 5, 6, 7, 8]);
      });

      it('should show the correct pages when maximum pages are >= the page count', () => {
        let pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(6, 6, 1);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(6, 6, 3);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(6, 6, 6);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(6, 8, 1);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(6, 8, 3);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        pageNumbers = (component.pagingComponent as any).getDisplayedPageNumbers(6, 8, 6);
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should be accessible', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.nativeElement).toBeAccessible();
        });
      }));
    });
  });
});

import { DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyPagingTestComponent } from './fixtures/paging.component.fixture';
import { SkyPagingFixturesModule } from './fixtures/paging.module.fixture';

describe('Paging component', () => {
  let component: SkyPagingTestComponent, fixture: any, element: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPagingFixturesModule],
    });

    fixture = TestBed.createComponent(SkyPagingTestComponent);
    element = fixture.debugElement as DebugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getPagingSelector(type: string): string {
    if (type === 'next' || type === 'previous') {
      return '.sky-paging-btn[sky-cmp-id="' + type + '"]';
    } else {
      return '.sky-list-paging-link button[sky-cmp-id="' + type + '"]';
    }
  }

  function getActivePageNumbers(): number[] {
    return element
      .queryAll(By.css('.sky-list-paging-link'))
      .map((el) => parseInt(el.nativeElement.innerText));
  }

  function verifyDisabled(elem: DebugElement): void {
    expect(elem.nativeElement.disabled).toBeTruthy();
  }

  function verifyEnabled(elem: DebugElement): void {
    expect(elem.nativeElement.disabled).toBeFalsy();
  }

  describe('with 8 items', () => {
    it('should show 3 pages', () => {
      expect(element.queryAll(By.css('.sky-list-paging-link')).length).toBe(3);
    });

    it('should have a disabled previous button', () => {
      const elem = element.query(By.css(getPagingSelector('previous')));
      verifyDisabled(elem);
    });

    it('should have an enabled next button', () => {
      const elem = element.query(By.css(getPagingSelector('next')));
      verifyEnabled(elem);
    });

    it('should show selected page 1 with special style', () => {
      expect(
        element
          .query(By.css(getPagingSelector('1')))
          .nativeElement.classList.contains('sky-paging-current'),
      ).toBe(true);
    });

    it('should not let you change page number to 5', () => {
      component.pagingComponent.setPage(5);
      fixture.detectChanges();

      expect(
        element
          .query(By.css(getPagingSelector('1')))
          .nativeElement.classList.contains('sky-paging-current'),
      ).toBe(true);
    });

    it('should not let you set page number to 0', () => {
      component.pagingComponent.setPage(0);
      fixture.detectChanges();

      expect(
        element
          .query(By.css(getPagingSelector('1')))
          .nativeElement.classList.contains('sky-paging-current'),
      ).toBe(true);
    });

    it('should set page count to 0 when pageSize is set to 0', () => {
      component.pageSize = 0;
      component.pagingComponent.setPage(0);
      fixture.detectChanges();

      expect(component.pagingComponent.pageCount).toEqual(0);
    });

    describe('after clicking page 3', () => {
      beforeEach(() => {
        element
          .query(By.css(getPagingSelector('3')))
          .triggerEventHandler('click', undefined);
        fixture.detectChanges();
      });

      it('should have an enabled previous button', () => {
        const elem = element.query(By.css(getPagingSelector('previous')));
        verifyEnabled(elem);
      });

      it('should have an enabled next button', () => {
        const elem = element.query(By.css(getPagingSelector('next')));
        verifyEnabled(elem);
      });

      it('should show selected page 3 with special style', () => {
        expect(
          element
            .query(By.css(getPagingSelector('3')))
            .nativeElement.classList.contains('sky-paging-current'),
        ).toBe(true);
      });

      it('should not show page 1', () => {
        expect(element.query(By.css(getPagingSelector('1')))).toBeNull();
      });

      it('should show page 4', () => {
        expect(element.query(By.css(getPagingSelector('4')))).not.toBeNull();
      });

      describe('and clicking next', () => {
        beforeEach(() => {
          element
            .query(By.css(getPagingSelector('next')))
            .triggerEventHandler('click', undefined);
          fixture.detectChanges();
        });

        it('should have enabled previous button', () => {
          const elem = element.query(By.css(getPagingSelector('previous')));
          verifyEnabled(elem);
        });

        it('should have disabled next button', () => {
          const elem = element.query(By.css(getPagingSelector('next')));
          verifyDisabled(elem);
        });
      });

      describe('and clicking previous twice', () => {
        beforeEach(() => {
          element
            .query(By.css(getPagingSelector('previous')))
            .triggerEventHandler('click', undefined);
          element
            .query(By.css(getPagingSelector('previous')))
            .triggerEventHandler('click', undefined);
          fixture.detectChanges();
        });

        it('should have disabled previous button', () => {
          const elem = element.query(By.css(getPagingSelector('previous')));
          verifyDisabled(elem);
        });

        it('should have enabled next button', () => {
          const elem = element.query(By.css(getPagingSelector('next')));
          verifyEnabled(elem);
        });

        it('should show selected page 1 with special style', () => {
          expect(
            element
              .query(By.css(getPagingSelector('1')))
              .nativeElement.classList.contains('sky-paging-current'),
          ).toBe(true);
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

        expect(
          element
            .query(By.css(getPagingSelector('2')))
            .nativeElement.classList.contains('sky-paging-current'),
        ).toBe(true);

        expect(
          element.query(By.css(getPagingSelector('previous'))).nativeElement
            .disabled,
        ).toBeFalsy();

        expect(
          element.query(By.css(getPagingSelector('next'))).nativeElement
            .disabled,
        ).toBeFalsy();
      });

      it('should react properly when itemCount is changed', () => {
        component.itemCount = 3;
        fixture.detectChanges();

        expect(element.query(By.css(getPagingSelector('3')))).toBeNull();
      });

      it('should react properly when pageSize is changed', () => {
        component.pageSize = 4;
        fixture.detectChanges();

        expect(element.query(By.css(getPagingSelector('3')))).toBeNull();
      });

      it('should react properly when maxPages is changed', () => {
        component.maxPages = 4;
        fixture.detectChanges();

        expect(element.query(By.css(getPagingSelector('4')))).not.toBeNull();
      });
    });

    describe('accessibility', () => {
      it('should have a nav role on the parent element with a given aria-label', () => {
        component.label = 'My label';
        fixture.detectChanges();

        const navElement = element.query(
          By.css('nav.sky-paging'),
        ).nativeElement;

        expect(navElement.getAttribute('aria-label')).toBe('My label');
      });

      it('should have a nav role on the parent element with a default aria-label', () => {
        const navElement = element.query(
          By.css('nav.sky-paging'),
        ).nativeElement;

        expect(navElement.getAttribute('aria-label')).toBe('Pagination');
      });

      it('should have aria-label on each of the next and previous buttons', () => {
        const prevElement = element.query(
          By.css(getPagingSelector('previous')),
        ).nativeElement;

        expect(prevElement.getAttribute('aria-label')).toBe('Previous');

        const nextElement = element.query(
          By.css(getPagingSelector('next')),
        ).nativeElement;

        expect(nextElement.getAttribute('aria-label')).toBe('Next');
      });

      it('should show the correct pages for an even number of maximum pages', () => {
        component.itemCount = 16;
        component.maxPages = 6;
        fixture.detectChanges();

        let pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        component.currentPage = 2;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        component.currentPage = 4;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        component.currentPage = 7;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([3, 4, 5, 6, 7, 8]);

        component.currentPage = 8;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([3, 4, 5, 6, 7, 8]);
      });

      it('should show the correct pages for an odd number of maximum pages', () => {
        component.itemCount = 16;
        component.maxPages = 5;
        fixture.detectChanges();

        let pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5]);

        component.currentPage = 2;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5]);

        component.currentPage = 4;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([2, 3, 4, 5, 6]);

        component.currentPage = 7;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([4, 5, 6, 7, 8]);

        component.currentPage = 8;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([4, 5, 6, 7, 8]);
      });

      it('should show the correct pages when maximum pages are >= the page count', () => {
        component.itemCount = 12;
        component.maxPages = 6;
        fixture.detectChanges();

        let pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        component.currentPage = 3;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        component.currentPage = 6;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        component.maxPages = 8;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        component.currentPage = 1;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);

        component.currentPage = 3;
        fixture.detectChanges();
        pageNumbers = getActivePageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should have an aria label for page number link', () => {
        component.currentPage = 1;
        component.maxPages = 8;
        fixture.detectChanges();

        const pageElement = element.query(By.css(getPagingSelector('2')))
          .nativeElement as HTMLButtonElement;

        expect(pageElement.ariaLabel).toBe('Page 2');
      });

      it('should be accessible', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });
  });
});

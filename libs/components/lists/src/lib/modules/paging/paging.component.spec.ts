import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { SkyPagingWithContentTestComponent } from './fixtures/paging-with-content.component.fixture';
import { SkyPagingTestComponent } from './fixtures/paging.component.fixture';
import { SkyPagingFixturesModule } from './fixtures/paging.module.fixture';

describe('Paging component', () => {
  function getPagingSelector(type: string): string {
    if (type === 'next' || type === 'previous') {
      return '.sky-paging-btn[sky-cmp-id="' + type + '"]';
    } else {
      return '.sky-list-paging-link button[sky-cmp-id="' + type + '"]';
    }
  }

  function clickPageButton(
    fixture: ComponentFixture<unknown>,
    button: string,
  ): void {
    fixture.debugElement
      .query(By.css(getPagingSelector(button)))
      .triggerEventHandler('click', undefined);

    fixture.detectChanges();
  }

  function getWaitInfo(fixture: ComponentFixture<unknown>): {
    isWaiting: boolean;
    ariaLabel?: string;
  } {
    const firstChild = (fixture.nativeElement as HTMLElement)
      .querySelector('sky-paging')
      ?.childNodes.item(0);

    if (firstChild?.nodeName === 'SKY-WAIT') {
      const waitMaskEl = (firstChild as HTMLElement).querySelector(
        '.sky-wait-mask',
      );

      return {
        isWaiting: !!waitMaskEl,
        ariaLabel: waitMaskEl?.ariaLabel ?? undefined,
      };
    }

    return {
      isWaiting: false,
    };
  }

  describe('without content', () => {
    let component: SkyPagingTestComponent;
    let fixture: ComponentFixture<SkyPagingTestComponent>;
    let element: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SkyPagingFixturesModule],
      });

      fixture = TestBed.createComponent(SkyPagingTestComponent);
      element = fixture.debugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

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
        expect(element.queryAll(By.css('.sky-list-paging-link')).length).toBe(
          3,
        );
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
          clickPageButton(fixture, '3');
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
            clickPageButton(fixture, 'next');
          });

          it('should have enabled previous button', () => {
            const elem = element.query(By.css(getPagingSelector('previous')));
            verifyEnabled(elem);
          });

          it('should have disabled next button', () => {
            const elem = element.query(By.css(getPagingSelector('next')));
            verifyDisabled(elem);
          });

          it('should not display a wait', () => {
            expect(getWaitInfo(fixture).isWaiting).toBeFalse();
          });
        });

        describe('and clicking previous twice', () => {
          beforeEach(() => {
            clickPageButton(fixture, 'previous');
            clickPageButton(fixture, 'previous');
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

        expect(element.queryAll(By.css('.sky-list-paging-link')).length).toBe(
          3,
        );
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

  describe('with content', () => {
    let fixture: ComponentFixture<SkyPagingWithContentTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SkyPagingFixturesModule],
      });

      fixture = TestBed.createComponent(SkyPagingWithContentTestComponent);
      fixture.detectChanges();
    });

    it('should display a wait when changing pages', () => {
      expect(getWaitInfo(fixture).isWaiting).toBeFalse();

      const liveAnnouncerSvc = TestBed.inject(SkyLiveAnnouncerService);
      const announceSpy = spyOn(liveAnnouncerSvc, 'announce');

      clickPageButton(fixture, '2');

      const waitInfo = getWaitInfo(fixture);

      expect(waitInfo.isWaiting).toBeTrue();
      expect(waitInfo.ariaLabel).toBe('Loading page 2');

      expect(announceSpy).toHaveBeenCalledOnceWith('Loading page 2');
      announceSpy.calls.reset();

      fixture.componentInstance.finishLoading();
      fixture.detectChanges();

      expect(getWaitInfo(fixture).isWaiting).toBeFalse();

      expect(announceSpy).toHaveBeenCalledOnceWith('Page 2 loaded.');
    });

    it('should set focus to the top of the paged contents and update the ARIA label when loading is complete', () => {
      const wrapperEl = (fixture.nativeElement as HTMLElement).querySelector(
        '.sky-paging-content-wrapper',
      );

      expect(wrapperEl?.ariaLabel).toBe('Page 1 of 4');

      clickPageButton(fixture, '2');

      expect(document.activeElement).not.toBe(wrapperEl);

      fixture.componentInstance.finishLoading();
      fixture.detectChanges();

      expect(document.activeElement).toBe(wrapperEl);

      expect(wrapperEl?.ariaLabel).toBe('Page 2 of 4');
    });
  });
});

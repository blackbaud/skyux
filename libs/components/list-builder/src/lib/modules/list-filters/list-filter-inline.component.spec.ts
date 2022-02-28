import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import { SkyCheckboxModule } from '@skyux/forms';

import { skip, take } from 'rxjs/operators';

import { SkyListToolbarModule } from '../list-toolbar/list-toolbar.module';
import { ListStateDispatcher } from '../list/state/list-state.rxstate';
import { ListState } from '../list/state/list-state.state-node';
import { ListPagingSetPageNumberAction } from '../list/state/paging/set-page-number.action';

import { ListFilterInlineTestComponent } from './fixtures/list-filter-inline.component.fixture';
import { SkyListFilterInlineModel } from './list-filter-inline.model';
import { SkyListFiltersModule } from './list-filters.module';

describe('List inline filters', () => {
  let state: ListState,
    dispatcher: ListStateDispatcher,
    fixture: ComponentFixture<ListFilterInlineTestComponent>,
    nativeElement: HTMLElement,
    component: ListFilterInlineTestComponent;

  beforeEach(async(() => {
    dispatcher = new ListStateDispatcher();
    state = new ListState(dispatcher);

    TestBed.configureTestingModule({
      declarations: [ListFilterInlineTestComponent],
      imports: [
        SkyListToolbarModule,
        SkyListFiltersModule,
        FormsModule,
        SkyCheckboxModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ListState, useValue: state },
        { provide: ListStateDispatcher, useValue: dispatcher },
      ],
    });

    fixture = TestBed.createComponent(ListFilterInlineTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  }));

  function getFilterButton() {
    return nativeElement.querySelector(
      '.sky-list-toolbar-container .sky-filter-btn'
    );
  }

  function getInlineFilters() {
    return nativeElement.querySelectorAll(
      '.sky-list-toolbar-container .sky-filter-inline-item'
    );
  }

  describe('standard setup', () => {
    beforeEach(async(() => {
      fixture.detectChanges();
      state.pipe(skip(1), take(1)).subscribe(() => fixture.detectChanges());
    }));
    it('should add a filter button and inline filters when provided', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      let filterButton = getFilterButton() as HTMLButtonElement;

      expect(filterButton).not.toBeNull();

      expect(getInlineFilters().length).toBe(0);

      filterButton.click();
      fixture.detectChanges();
      tick();
      expect(getInlineFilters().length).toBe(2);
    }));

    it('should populate aria labels for inline filters', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      let filterButton = getFilterButton() as HTMLButtonElement;

      filterButton.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(filterButton.getAttribute('aria-controls')).toBeTruthy();
      let inlineFilter = document.querySelector(
        `#${filterButton.getAttribute('aria-controls')}`
      );

      expect(filterButton.getAttribute('aria-controls')).toBe(inlineFilter.id);
      expect(filterButton.getAttribute('aria-expanded')).toBe('true');
      expect(inlineFilter.getAttribute('aria-labelledby')).toBe(
        filterButton.id
      );

      filterButton.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(filterButton.getAttribute('aria-expanded')).toBe('false');
      expect(filterButton.getAttribute('aria-controls')).toBeFalsy();
    }));

    it('should filter appropriately when change function is called', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      state.pipe(take(1)).subscribe((current) => {
        expect(current.filters.length).toBe(2);
        expect(current.filters[0].value).toBe('any');
        expect(current.filters[0].defaultValue).toBe('any');
      });
      let filterButton = getFilterButton() as HTMLButtonElement;

      expect(filterButton).not.toHaveCssClass('sky-filter-btn-active');
      tick();
      filterButton.click();
      tick();
      fixture.detectChanges();
      let selectEl = nativeElement.querySelector(
        '#sky-demo-select-type'
      ) as HTMLSelectElement;
      selectEl.value = 'berry';
      SkyAppTestUtility.fireDomEvent(selectEl, 'change');
      tick();
      fixture.detectChanges();
      tick();
      state.pipe(take(1)).subscribe((current) => {
        expect(current.filters.length).toBe(2);
        expect(current.filters[0].value).toBe('berry');
        expect(current.filters[0].defaultValue).toBe('any');
      });

      filterButton = getFilterButton() as HTMLButtonElement;

      expect(filterButton).toHaveCssClass('sky-filter-btn-active');
    }));

    it('should return the list to the first page when filters are applied', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      dispatcher.next(new ListPagingSetPageNumberAction(Number(2)));
      let filterButton = getFilterButton() as HTMLButtonElement;

      tick();
      filterButton.click();
      state.pipe(take(1)).subscribe((current) => {
        expect(current.paging.pageNumber).toBe(2);
      });
      tick();
      fixture.detectChanges();
      let selectEl = nativeElement.querySelector(
        '#sky-demo-select-type'
      ) as HTMLSelectElement;
      selectEl.value = 'berry';
      SkyAppTestUtility.fireDomEvent(selectEl, 'change');
      tick();
      fixture.detectChanges();
      tick();
      state.pipe(take(1)).subscribe((current) => {
        expect(current.paging.pageNumber).toBe(1);
      });
    }));

    it('should handle a model without data properly', () => {
      let inlineFilter = new SkyListFilterInlineModel();
      expect(inlineFilter).not.toBeNull();
    });
  });

  it('should throw an error if inline filter does not have a name', () => {
    component.hideOrangeName = '';
    expect(() => {
      fixture.detectChanges();
    }).toThrowError();
  });
});

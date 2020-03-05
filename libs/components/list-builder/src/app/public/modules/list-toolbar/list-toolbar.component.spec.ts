import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListState,
  ListStateDispatcher
} from '../list/state';

import {
  SkyListToolbarModule
} from './';

import {
  ListToolbarTestComponent
} from './fixtures/list-toolbar.component.fixture';

import {
  ListItemsLoadAction,
  ListPagingSetPageNumberAction,
  ListSortLabelModel,
  ListToolbarItemModel,
  ListToolbarItemsLoadAction,
  ListToolbarSetTypeAction,
  ListViewModel,
  ListViewsLoadAction,
  ListViewsSetActiveAction
} from '../list/state';

describe('List Toolbar Component', () => {
  let state: ListState,
      dispatcher: ListStateDispatcher,
      fixture: ComponentFixture<ListToolbarTestComponent>,
      nativeElement: HTMLElement,
      component: ListToolbarTestComponent,
      element: DebugElement;

  beforeEach(() => {
    dispatcher = new ListStateDispatcher();
    state = new ListState(dispatcher);

    TestBed.configureTestingModule({
      declarations: [
        ListToolbarTestComponent
      ],
      imports: [
        SkyListToolbarModule
      ],
      providers: [
        { provide: ListState, useValue: state },
        { provide: ListStateDispatcher, useValue: dispatcher }
      ]
    });

    fixture = TestBed.createComponent(ListToolbarTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    element = fixture.debugElement as DebugElement;
    component = fixture.componentInstance;
  });

  // #region helpers
  function initializeToolbar() {
    fixture.detectChanges();
    // always skip the first update to ListState, when state is ready
    // run detectChanges once more then begin tests
    state.skip(1).take(1).subscribe(() => fixture.detectChanges());
  }

  function getMultiselectActionToolbar() {
    return element.query(By.css('.sky-list-multiselect-toolbar'));
  }

  function getSelectAllButton() {
    return element.queryAll(By.css('.sky-list-multiselect-toolbar button'))[0];
  }

  function getClearAllButton() {
    return element.queryAll(By.css('.sky-list-multiselect-toolbar button'))[1];
  }

  function getOnlyShowSelectedCheckbox() {
    return element.query(By.css('.sky-list-multiselect-toolbar input'));
  }

  function clickSelectAllButton() {
    const selectAllButton = getSelectAllButton();
    selectAllButton.nativeElement.click();
    fixture.detectChanges();
  }

  function clickClearAllButton() {
    const clearAllButton = getClearAllButton();
    clearAllButton.nativeElement.click();
    fixture.detectChanges();
  }

  function clickShowOnlySelectedCheckbox() {
    const showOnlySelectedCheckbox = getOnlyShowSelectedCheckbox();
    showOnlySelectedCheckbox.nativeElement.click();
    fixture.detectChanges();
  }

  function initializeToolbarWithMultiselect() {
    initializeToolbar();
    dispatcher.toolbarShowMultiselectToolbar(true);
    fixture.detectChanges();
  }

  function verifySearchTypeToolbar() {
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.sky-list-toolbar-search .sky-toolbar-section');
    expect(sections.length).toBe(2);
    expect(sections.item(0).querySelector('input')).not.toBeNull();
    expect(component.toolbar.searchComponent.expandMode).toBe('fit');

    const items = sections.item(1).querySelectorAll('.sky-toolbar-item sky-list-toolbar-item-renderer');
    expect(items.item(0).querySelector('.sky-sort')).not.toBeNull();
    expect(items.item(2)).toHaveText('Custom Item');
    expect(items.item(3)).toHaveText('Custom Item 2');
  }
  // #endregion

  describe('search', () => {
    it('should be visible by default', async(() => {
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(element.query(By.css('input'))).not.toBeNull();
      });
    }));

    it('should be able to disable search on initialization', async(() => {
      component.searchEnabled = false;
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(element.query(By.css('input'))).toBeNull();
      });
    }));

    it('should set search text on initialization', async(() => {
      component.searchText = 'searchText';
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.toolbar.searchComponent.searchText).toBe('searchText');
      });
    }));

    it('should update list state search text on component apply', async(() => {
      let stateChecked = false;
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        component.toolbar.searchComponent.applySearchText('something');
        fixture.detectChanges();
        state.take(1).subscribe((s) => {
          expect(s.search.searchText).toBe('something');
          stateChecked = true;
        });
        fixture.detectChanges();
        expect(stateChecked).toBe(true);
      });
    }));

    it('should set pagination to first page when when searching', async(() => {
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        dispatcher.next(
          new ListPagingSetPageNumberAction(Number(2))
        );

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          component.toolbar.searchComponent.applySearchText('something');
          fixture.detectChanges();
          state.take(1).subscribe((s) => {
            expect(s.search.searchText).toBe('something');
            expect(s.paging.pageNumber).toBe(1);
          });
          fixture.detectChanges();
        });
      });
    }));

    it('should not set pagination to first page when pagination is undefined', async(() => {
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          component.toolbar.searchComponent.applySearchText('something');
          fixture.detectChanges();
          state.take(1).subscribe((s) => {
            expect(s.search.searchText).toBe('something');
            expect(s.paging.pageNumber).not.toBe(1);
          });
          fixture.detectChanges();
        });
      });
    }));

    it('should emit a value on the searchApplied property when a search is applied', async(() => {
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const spy = spyOn(component.toolbar.searchApplied, 'next').and.callThrough();

        component.toolbar.searchComponent.applySearchText('something');
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('something');
      });
    }));

    it('should call list state dispatcher when inMemorySearchEnabled is undefined', async(() => {
      component.inMemorySearchEnabled = undefined;
      initializeToolbar();
      const setTextSpy = spyOn(dispatcher, 'searchSetText').and.callThrough();
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        component.toolbar.searchComponent.applySearchText('something');
        fixture.detectChanges();

        expect(setTextSpy).toHaveBeenCalledTimes(1);
      });
    }));

    it('should call list state dispatcher when inMemorySearchEnabled is true', async(() => {
      component.inMemorySearchEnabled = true;
      initializeToolbar();
      const setTextSpy = spyOn(dispatcher, 'searchSetText').and.callThrough();
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        component.toolbar.searchComponent.applySearchText('something');
        fixture.detectChanges();

        expect(setTextSpy).toHaveBeenCalledTimes(1);
      });
    }));

    it('should not call list state dispatcher when inMemorySearchEnabled is false', async(() => {
      component.inMemorySearchEnabled = false;
      initializeToolbar();
      const setTextSpy = spyOn(dispatcher, 'searchSetText').and.callThrough();
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        component.toolbar.searchComponent.applySearchText('something');
        fixture.detectChanges();

        expect(setTextSpy).not.toHaveBeenCalledTimes(1);
      });
    }));
  });

  describe('sort selector', () => {
    beforeEach(async(() => {
      dispatcher.sortSetAvailable([
        new ListSortLabelModel({
          text: 'Status (A - Z)',
          fieldType: 'string',
          fieldSelector: 'status',
          global: true,
          descending: false
        }),
          new ListSortLabelModel({
          text: 'Status (Z - A)',
          fieldType: 'string',
          fieldSelector: 'status',
          global: true,
          descending: true
        }),
        new ListSortLabelModel({
          text: 'Date (Most recent first)',
          fieldType: 'date',
          fieldSelector: 'date',
          global: true,
          descending: true
        }),
        new ListSortLabelModel({
          text: 'Date (Most recent last)',
          fieldType: 'date',
          fieldSelector: 'date',
          global: true,
          descending: false
        }),
        new ListSortLabelModel({
          text: 'Number (Highest first)',
          fieldType: 'number',
          fieldSelector: 'number',
          global: true,
          descending: true
        }),
          new ListSortLabelModel({
          text: 'Number (Lowest first)',
          fieldType: 'number',
          fieldSelector: 'number',
          global: true,
          descending: false
        })
      ]);
    }));

    it('should display when sort provided', async(() => {
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(element.query(
          By.css("sky-list-toolbar-item-renderer[sky-cmp-id='sort-selector']")
        )).not.toBeNull();
      });
    }));

    it('should remove sort when sort selectors not available', fakeAsync(() => {
      initializeToolbar();
      tick();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        tick();
        dispatcher.sortSetGlobal([]);
        dispatcher.sortSetAvailable([]);
        fixture.detectChanges();
        tick();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          state.take(1).subscribe((current) => {
            expect(current.toolbar.items
            .filter((item) => { return item.id === 'sort-selector'; }).length).toBe(0);
          });
        });
      });
    }));

    it('should not display when sortSelectorEnabled is false', async(() => {
      component.sortEnabled = false;
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(element.query(By.css('.sky-sort'))).toBeNull();
      });
    }));

    function verifyInnerText(elem: Element, needle: string) {
      expect(elem.textContent.trim().indexOf(needle) > -1).toEqual(true);
    }

    it('should create ascending and descending items for each sort label', fakeAsync(() => {
      initializeToolbar();

      tick();
      fixture.detectChanges();

      const sortItems = nativeElement.querySelectorAll('.sky-sort .sky-sort-item');

      expect(sortItems.length).toBe(8);
      verifyInnerText(sortItems.item(0), 'Custom');
      verifyInnerText(sortItems.item(1), 'Custom');
      verifyInnerText(sortItems.item(2), 'Status (A - Z)');
      verifyInnerText(sortItems.item(3), 'Status (Z - A)');
      verifyInnerText(sortItems.item(4), 'Date (Most recent first)');
      verifyInnerText(sortItems.item(5), 'Date (Most recent last)');
      verifyInnerText(sortItems.item(6), 'Number (Highest first)');
      verifyInnerText(sortItems.item(7), 'Number (Lowest first)');
    }));

    it('should handle sort item click', async(() => {
      initializeToolbar();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        let sortSelectorDropdownButtonEl = nativeElement
          .querySelector('.sky-sort .sky-dropdown-button') as HTMLButtonElement;
        sortSelectorDropdownButtonEl.click();

        let sortItems = nativeElement.querySelectorAll('.sky-sort-item');

        let clickItem = sortItems.item(1).querySelector('button') as HTMLButtonElement;

        clickItem.click();
        fixture.detectChanges();
        sortItems = nativeElement.querySelectorAll('.sky-sort-item');
        expect(sortItems.item(1)).toHaveCssClass('sky-sort-item-selected');

        clickItem = sortItems.item(0).querySelector('button') as HTMLButtonElement;

        clickItem.click();
        fixture.detectChanges();
        sortItems = nativeElement.querySelectorAll('.sky-sort-item');
        expect(sortItems.item(0)).toHaveCssClass('sky-sort-item-selected');
        });

    }));

    it('should load custom items', async(() => {
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const items = fixture.nativeElement.querySelectorAll('.sky-toolbar-item');
        expect(items.item(0).querySelector('.sky-sort')).not.toBeNull();
        expect(items.item(3)).toHaveText('Custom Item');
        expect(items.item(4)).toHaveText('Custom Item 2');
      });
    }));

    it('should load custom items when toggled via an ngIf', async(() => {
      initializeToolbar();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let items: NodeList = fixture.nativeElement.querySelectorAll('.sky-toolbar-item');
        expect((items.item(0) as HTMLElement).querySelector('.sky-sort')).not.toBeNull();
        expect(items.item(3)).toHaveText('Custom Item');
        expect(items.item(4)).toHaveText('Custom Item 2');
        expect(items.length).toBe(5);

        component.showCutomItem1 = false;

        fixture.detectChanges();
        items = fixture.nativeElement.querySelectorAll('.sky-toolbar-item');
        expect((items.item(0) as HTMLElement).querySelector('.sky-sort')).not.toBeNull();
        expect(items.item(3)).toHaveText('Custom Item 2');
        expect(items.length).toBe(4);

        component.showCutomItem1 = true;

        fixture.detectChanges();
        items = fixture.nativeElement.querySelectorAll('.sky-toolbar-item');
        expect((items.item(0) as HTMLElement).querySelector('.sky-sort')).not.toBeNull();
        expect(items.item(3)).toHaveText('Custom Item');
        expect(items.item(4)).toHaveText('Custom Item 2');
        expect(items.length).toBe(5);
      });
    }));

    it('should load custom items with toolbarType = search initialized', async(() => {
      component.toolbarType = 'search';
      fixture.detectChanges();
      initializeToolbar();
      fixture.whenStable().then(() => {
        verifySearchTypeToolbar();
      });
    }));

    it('should load custom items with toolbarType = search set by the state', async(() => {
      initializeToolbar();
      dispatcher.next(new ListToolbarSetTypeAction('search'));
      fixture.whenStable().then(() => {
        verifySearchTypeToolbar();
      });
    }));
  });

  describe('multiselect action bar', () => {
    beforeEach(() => {
      // Add some base items to be selected.
      dispatcher.next(new ListItemsLoadAction([
        new ListItemModel('1', {}),
        new ListItemModel('2', {}),
        new ListItemModel('3', {}),
        new ListItemModel('4', {}),
        new ListItemModel('5', {}),
        new ListItemModel('6', {}),
        new ListItemModel('7', {})
      ], true));

      fixture.detectChanges();
    });

    it('should be hidden by default', () => {
      initializeToolbar();
      expect(getMultiselectActionToolbar()).toBeNull();
    });

    it('should toggle visibility when toolbarShowMultiselectToolbar is updated', () => {
      initializeToolbar();

      // Call dispatcher. Expect action bar is visible.
      dispatcher.toolbarShowMultiselectToolbar(true);
      fixture.detectChanges();
      expect(getMultiselectActionToolbar()).not.toBeNull();

      // Call dispatcher. Expect action bar is hidden.
      dispatcher.toolbarShowMultiselectToolbar(false);
      fixture.detectChanges();
      expect(getMultiselectActionToolbar()).toBeNull();
    });

    it('should call the dispatcher when select all is clicked', () => {
      initializeToolbarWithMultiselect();
      const setSelectedSpy = spyOn(dispatcher, 'setSelected').and.callThrough();

      clickSelectAllButton();

      expect(setSelectedSpy).toHaveBeenCalled();
    });

    it('should only reapply the filter when select all is clicked while "Show only selected" is checked', () => {
      initializeToolbarWithMultiselect();
      const filtersUpdateSpy = spyOn(dispatcher, 'filtersUpdate').and.callThrough();

      // Click "Select all" and expect filters are NOT updated.
      clickSelectAllButton();
      expect(filtersUpdateSpy).not.toHaveBeenCalled();

      // Now, check "Only show selected" and click "Select all". Expect filters to be updated.
      clickShowOnlySelectedCheckbox();
      filtersUpdateSpy.calls.reset();
      clickSelectAllButton();

      expect(filtersUpdateSpy).toHaveBeenCalled();
    });

    it('should call the dispatcher when clear all is clicked', () => {
      initializeToolbarWithMultiselect();
      const setSelectedSpy = spyOn(dispatcher, 'setSelected').and.callThrough();

      clickClearAllButton();

      expect(setSelectedSpy).toHaveBeenCalled();
    });

    it('should only reapply the filter when clear all is clicked while "Show only selected" is checked', () => {
      initializeToolbarWithMultiselect();
      const filtersUpdateSpy = spyOn(dispatcher, 'filtersUpdate').and.callThrough();

      // Click "Clear all" and expect filters are NOT updated.
      clickClearAllButton();
      expect(filtersUpdateSpy).not.toHaveBeenCalled();

      // Now, check "Only show selected" and click "Clear all". Expect filters to be updated.
      clickShowOnlySelectedCheckbox();
      filtersUpdateSpy.calls.reset();
      clickClearAllButton();

      expect(filtersUpdateSpy).toHaveBeenCalled();
    });

    it('should reapply filter only when state.items are changed AND "Show only selected" is checked', () => {
      initializeToolbarWithMultiselect();
      const filtersUpdateSpy = spyOn(dispatcher, 'filtersUpdate').and.callThrough();

      expect(filtersUpdateSpy).not.toHaveBeenCalled();

      // Send selection to dispatcher and expect filter update to have NOT been called.
      dispatcher.setSelected(['1'], true);
      fixture.detectChanges();
      expect(filtersUpdateSpy).not.toHaveBeenCalled();

      // Click "Show only selected" and send new selection to dispatcher. Expect filter update to have been called.
      clickShowOnlySelectedCheckbox();
      filtersUpdateSpy.calls.reset();
      dispatcher.setSelected(['1', '2'], true);
      fixture.detectChanges();
      expect(filtersUpdateSpy).toHaveBeenCalled();
    });

    it('should only return selected items when "Show only selected" is checked', () => {
      initializeToolbarWithMultiselect();

      // Send selection to dispatcher and click "Show only selected".
      dispatcher.setSelected(['1', '2'], true);
      fixture.detectChanges();
      clickShowOnlySelectedCheckbox();
      fixture.detectChanges();

      // Expect "show-selected" filter is set up.
      state
        .map(s => s.filters)
        .take(1)
        .subscribe(filters => {
          let showSelectedFilter = filters.filter(filter => filter.name === 'show-selected')[0];
          expect(showSelectedFilter).not.toBeNull();

          // Expect filter function to only return rows with id '1' and '2'.
          let filterFunction = showSelectedFilter.filterFunction;
          expect(filterFunction(new ListItemModel('1', {}), true)).toEqual(true);
          expect(filterFunction(new ListItemModel('2', {}), true)).toEqual(true);
          expect(filterFunction(new ListItemModel('3', {}), true)).toBe(undefined);
          expect(filterFunction(new ListItemModel('4', {}), true)).toBe(undefined);
          expect(filterFunction(new ListItemModel('5', {}), true)).toBe(undefined);
          expect(filterFunction(new ListItemModel('6', {}), true)).toBe(undefined);
          expect(filterFunction(new ListItemModel('7', {}), true)).toBe(undefined);
        });
    });

    it('should always return to page 1 when "Show only selected" is checked', () => {
      initializeToolbarWithMultiselect();

      // Tell dispatcher to go to page 99.
      dispatcher.next(new ListPagingSetPageNumberAction(Number(99)));
      fixture.detectChanges();

      // Expect page number to be set to 99.
      state
      .map(s => s.paging)
      .take(1)
      .subscribe(paging => {
        expect(paging.pageNumber).toEqual(99);
      });

      // Send selection to dispatcher and click "Show only selected".
      dispatcher.setSelected(['1', '2'], true);
      fixture.detectChanges();
      clickShowOnlySelectedCheckbox();
      fixture.detectChanges();

      // Expect page number to be set to 1.
      state
      .map(s => s.paging)
      .take(1)
      .subscribe(paging => {
        expect(paging.pageNumber).toEqual(1);
      });
    });
  });

  it('should not display items not in the current view', async(() => {
    initializeToolbar();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      dispatcher.next(
        new ListViewsLoadAction([new ListViewModel('myview', 'view label')])
      );
      fixture.detectChanges();

      // activate the default view
      dispatcher.next(new ListViewsSetActiveAction('myview'));
      fixture.detectChanges();

      dispatcher.next(new ListToolbarItemsLoadAction([
        new ListToolbarItemModel({
          id: 'newitem',
          location: 'center',
          view: 'myview',
          template: component.default
        })
      ]));
      fixture.detectChanges();

      let items = element.queryAll(By.css('.sky-toolbar-item'));
      expect(items[0].query(By.css('.sky-sort'))).not.toBeNull();
      expect(items[2].query(By.css('span')).nativeElement).toHaveCssClass('sky-test-toolbar');
      expect(items[3].query(By.css('.sky-search-input'))).not.toBeNull();
      expect(items[4].nativeElement).toHaveText('Custom Item');
      expect(items[5].nativeElement).toHaveText('Custom Item 2');

      dispatcher.next(new ListToolbarItemsLoadAction([
        new ListToolbarItemModel({
          id: 'newitem2',
          location: 'center',
          view: 'myview1',
          template: component.default
        })
      ]));
      fixture.detectChanges();

      items = element.queryAll(By.css('.sky-toolbar-item'));
      expect(items[0].query(By.css('.sky-sort'))).not.toBeNull();
      expect(items[2].query(By.css('span')).nativeElement).toHaveCssClass('sky-test-toolbar');
      expect(items[3].query(By.css('.sky-search-input'))).not.toBeNull();
      expect(items[4].nativeElement).toHaveText('Custom Item');
      expect(items[5].nativeElement).toHaveText('Custom Item 2');
    });
  }));
});

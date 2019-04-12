import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  Observable
} from 'rxjs/Observable';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  SkyListModule,
  SkyListComponent,
  SkyListToolbarModule,
  SkyListPagingModule
} from '@skyux/list-builder';

import {
  ListItemsLoadAction,
  ListState,
  ListStateDispatcher,
  ListViewsLoadAction,
  ListViewModel
} from '@skyux/list-builder/modules/list/state';

import {
  ListViewChecklistTestComponent
} from './fixtures/list-view-checklist.component.fixture';

import {
  ListViewChecklistEmptyTestComponent
} from './fixtures/list-view-checklist-empty.component.fixture';

import {
  ListViewChecklistToolbarTestComponent
} from './fixtures/list-view-checklist-toolbar.component.fixture';

import {
  SkyListViewChecklistModule
} from './';

import {
  ListViewChecklistItemsLoadAction
} from './state/items/actions';

import {
  ListViewChecklistItemModel
} from './state/items/item.model';

import {
  ChecklistState,
  ChecklistStateDispatcher,
  ChecklistStateModel
} from './state';

import {
  ListViewChecklistPaginationTestComponent
} from './fixtures/list-view-checklist-pagination.component.fixture';

//#region helpers
function getSingleSelectButtons(): NodeListOf<Element> {
  return document.querySelectorAll('.sky-list-view-checklist-item .sky-list-view-checklist-single-button');
}

function getSelectAllButton(): HTMLElement {
  return document.querySelectorAll('.sky-list-multiselect-toolbar button')[0] as HTMLElement;
}

function getClearAllButton(): HTMLElement {
  return document.querySelectorAll('.sky-list-multiselect-toolbar button')[1] as HTMLElement;
}

function getOnlyShowSelectedCheckbox(): HTMLElement {
  return document.querySelector('.sky-list-multiselect-toolbar input') as HTMLElement;
}

function multiselectToolbarDefined(): boolean {
  return !!(getSelectAllButton() && getClearAllButton() && getOnlyShowSelectedCheckbox());
}

function clickSelectAllButton(fixture: ComponentFixture<any>): void {
  getSelectAllButton().click();
  tick();
  fixture.detectChanges();
}

function clickClearAllButton(fixture: ComponentFixture<any>): void {
  getClearAllButton().click();
  tick();
  fixture.detectChanges();
}

function toggleOnlyShowSelected(fixture: ComponentFixture<any>): void {
  getOnlyShowSelectedCheckbox().click();
  tick();
  fixture.detectChanges();
}

function goToNextPage(fixture: ComponentFixture<any>): void {
  let nextButton = document.querySelector('.sky-paging-btn-next');
  (nextButton as HTMLElement).click();
  tick();
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
}

function getChecklistItems(): NodeListOf<Element> {
  return document.querySelectorAll('.sky-list-view-checklist-item sky-checkbox input');
}

function checkItem(fixture: ComponentFixture<any>, index: number): void {
  let checkboxes = getChecklistItems();
  (checkboxes.item(index) as HTMLElement).click();
  tick();
  fixture.detectChanges();
}

const itemsArray = [
  new ListItemModel('1', {
    column1: '1', column2: 'Apple',
    column4: 1
  }),
  new ListItemModel('2', {
    column1: '01', column2: 'Banana',
    column4: 6, column5: 'test'
  }),
  new ListItemModel('3', {
    column1: '11', column2: 'Banana',
    column4: 4
  }),
  new ListItemModel('4', {
    column1: '12', column2: 'Daikon',
    column4: 2
  }),
  new ListItemModel('5', {
    column1: '13', column2: 'Edamame',
    column4: 5
  }),
  new ListItemModel('6', {
    column1: '20', column2: 'Fig',
    column4: 3
  }),
  new ListItemModel('7', {
    column1: '21', column2: 'Grape',
    column4: 7
  }),
  new ListItemModel('8', {
    column1: '31', column2: 'Foo',
    column4: 8
  }),
  new ListItemModel('9', {
    column1: '19', column2: 'Bar',
    column4: 9
  }),
  new ListItemModel('10', {
    column1: '29', column2: 'Baz',
    column4: 10
  }),
  new ListItemModel('11', {
    column1: '0', column2: 'Fuzz',
    column4: 11
  })
];
//#endregion

describe('List View Checklist Component', () => {

  describe('Basic Fixture', () => {
    let state: ListState,
      dispatcher: ListStateDispatcher,
      component: ListViewChecklistTestComponent,
      fixture: any,
      element: DebugElement,
      items: Array<any>;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        declarations: [
          ListViewChecklistTestComponent
        ],
        imports: [
          SkyListViewChecklistModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher }
        ]
      });

      fixture = TestBed.createComponent(ListViewChecklistTestComponent);
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      items = [
        new ListItemModel('1', {
          column1: '1', column2: 'Apple',
          column4: 1
        }),
        new ListItemModel('2', {
          column1: '01', column2: 'Banana',
          column4: 6, column5: 'test'
        }),
        new ListItemModel('3', {
          column1: '11', column2: 'Banana',
          column4: 4
        }),
        new ListItemModel('4', {
          column1: '12', column2: 'Daikon',
          column4: 2
        }),
        new ListItemModel('5', {
          column1: '13', column2: 'Edamame',
          column4: 5
        }),
        new ListItemModel('6', {
          column1: '20', column2: 'Fig',
          column4: 3
        }),
        new ListItemModel('7', {
          column1: '21', column2: 'Grape',
          column4: 7
        }),
        new ListItemModel('8', { column1: '22' })
      ];

      dispatcher.next(new ListItemsLoadAction(items, true));
      dispatcher.next(new ListViewsLoadAction([
        new ListViewModel(component.checklist.id, component.checklist.label)
      ]));
      dispatcher.viewsSetActive(component.checklist.id);
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should show checklist with proper labels', () => {
      expect(element.queryAll(By.css('sky-list-view-checklist-item')).length).toBe(8);
      expect(element.query(
        By.css('sky-list-view-checklist-item sky-checkbox-label .sky-emphasized')
      ).nativeElement.textContent.trim()).toBe('1');
      expect(element.queryAll(
        By.css('sky-list-view-checklist-item sky-checkbox-label div')
      )[1].nativeElement.textContent.trim()).toBe('Apple');
    });

    it('should search based on input text', async(() => {
      let searchItems = items.filter(item => component.checklist.searchFunction()(item.data, '12'));
      dispatcher.next(new ListItemsLoadAction(searchItems, true));
      fixture.detectChanges();
      expect(element.queryAll(By.css('sky-list-view-checklist-item')).length).toBe(1);

      searchItems = items.filter(item => component.checklist.searchFunction()(item.data, 'banana'));
      dispatcher.next(new ListItemsLoadAction(searchItems, true));
      fixture.detectChanges();
      expect(element.queryAll(By.css('sky-list-view-checklist-item')).length).toBe(2);

      searchItems = items.filter(item => component.checklist.searchFunction()(item.data, 'bb'));
      dispatcher.next(new ListItemsLoadAction(searchItems, true));
      fixture.detectChanges();
      expect(element.queryAll(By.css('sky-list-view-checklist-item')).length).toBe(0);
    }));
  });

  describe('Empty Fixture', () => {
    let state: ListState,
      dispatcher: ListStateDispatcher,
      component: ListViewChecklistEmptyTestComponent,
      fixture: any,
      items: Array<any>,
      element: DebugElement;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        declarations: [
          ListViewChecklistEmptyTestComponent
        ],
        imports: [
          SkyListViewChecklistModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher }
        ]
      });

      fixture = TestBed.createComponent(ListViewChecklistEmptyTestComponent);
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      items = [
        new ListItemModel('1', {
          column1: '1', column2: 'Apple',
          column3: 1, column4: 1
        })
      ];

      dispatcher.next(new ListItemsLoadAction(items, true));
      dispatcher.next(new ListViewsLoadAction([
        new ListViewModel(component.checklist.id, component.checklist.label)
      ]));
      dispatcher.viewsSetActive(component.checklist.id);
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should display 1 empty item', () => {
      expect(element.queryAll(By.css('sky-list-view-checklist-item')).length).toBe(1);
      expect(element.query(
        By.css('sky-list-view-checklist-item sky-checkbox-label')
      ).nativeElement.textContent.trim()).toBe('');
    });

    it('should search based on input text', async(() => {
      let searchItems = items.filter((item) => {
        return component.checklist.searchFunction()(item.data, 'banana');
      });
      dispatcher.next(new ListItemsLoadAction(searchItems, true));
      fixture.detectChanges();
      expect(element.queryAll(By.css('sky-list-view-checklist-item')).length).toBe(0);
    }));
  });

  describe('With Pagination', () => {
    let dispatcher: ListStateDispatcher,
      state: ListState,
      fixture: ComponentFixture<ListViewChecklistPaginationTestComponent>;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        declarations: [
          ListViewChecklistPaginationTestComponent
        ],
        imports: [
          SkyListModule,
          SkyListToolbarModule,
          SkyListViewChecklistModule,
          SkyListPagingModule
        ]
      })
        .overrideComponent(SkyListComponent, {
          set: {
            providers: [
              { provide: ListState, useValue: state },
              { provide: ListStateDispatcher, useValue: dispatcher }
            ]
          }
        });

      fixture = TestBed.createComponent(ListViewChecklistPaginationTestComponent);
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should go to page 1 when "only show selected" is checked', fakeAsync(() => {
      // Expect we start on page 1.
      state.take(1).subscribe((data) => {
        expect(data.paging.pageNumber).toEqual(1);
      });

      // Go to next page.
      goToNextPage(fixture);
      state.take(1).subscribe((data) => {
        expect(data.paging.pageNumber).toEqual(2);
      });

      // Select something, and turn on "Show only selected".
      checkItem(fixture, 0);
      toggleOnlyShowSelected(fixture);

      // Expect we are sent back to page 1.
      state.take(1).subscribe((data) => {
        expect(data.paging.pageNumber).toEqual(1);
      });
    }));
  });

  describe('Checklist with toolbar', () => {
    let dispatcher: ListStateDispatcher,
      state: ListState,
      bs: BehaviorSubject<Array<any>>,
      items: Observable<Array<any>>,
      fixture: ComponentFixture<ListViewChecklistToolbarTestComponent>,
      nativeElement: HTMLElement,
      component: ListViewChecklistToolbarTestComponent;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      bs = new BehaviorSubject<Array<any>>(itemsArray);
      items = bs.asObservable();

      TestBed.configureTestingModule({
        declarations: [
          ListViewChecklistToolbarTestComponent
        ],
        imports: [
          SkyListModule,
          SkyListToolbarModule,
          SkyListViewChecklistModule
        ],
        providers: [
          { provide: 'items', useValue: items }
        ]
      })
        .overrideComponent(SkyListComponent, {
          set: {
            providers: [
              { provide: ListState, useValue: state },
              { provide: ListStateDispatcher, useValue: dispatcher }
            ]
          }
        });

      fixture = TestBed.createComponent(ListViewChecklistToolbarTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    describe('without pagination', () => {
      it('should NOT go to the first page when "showOnlySelected" is selected', fakeAsync(() => {
        // Expect pagination to be undefined.
        state.take(1).subscribe((data) => {
          expect(data.paging.pageNumber).toBeUndefined();
        });

        // Select something, and turn on "Show only selected".
        checkItem(fixture, 0);
        toggleOnlyShowSelected(fixture);

        // Expect pagination is still undefined.
        state.take(1).subscribe((data) => {
          expect(data.paging.pageNumber).toBeUndefined();
        });
      }));

      it('should show all items if pagination is not defined and items are larger than the pagination default', fakeAsync(() => {
        let checklistItems = getChecklistItems();
        expect(itemsArray.length).toBeGreaterThan(10); // 10 is the pagination default.
        expect(checklistItems.length).toEqual(itemsArray.length);
      }));
    });

    it('should set selections on click properly', fakeAsync(() => {
      let labelEl = <HTMLLabelElement>nativeElement
        .querySelectorAll('.sky-list-view-checklist label.sky-checkbox-wrapper')[0];

      labelEl.click();
      tick();
      fixture.detectChanges();

      expect(component.selectedItems.get('1')).toBe(true);

      labelEl = <HTMLLabelElement>nativeElement
        .querySelectorAll('.sky-list-view-checklist label.sky-checkbox-wrapper')[0];
      labelEl.click();
      tick();
      fixture.detectChanges();

      expect(component.selectedItems.get('1')).toBe(false);

    }));

    it('should show all items if showOnlySelected checkbox is clicked twice', fakeAsync(() => {
      toggleOnlyShowSelected(fixture);
      toggleOnlyShowSelected(fixture);

      let visibleCheckboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(visibleCheckboxesLength).toEqual(itemsArray.length);
    }));

    it('should show selected items if \'showOnlySelected\' property is set', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      let checkboxes = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input');
      (checkboxes.item(0) as HTMLElement).click();
      tick();
      fixture.detectChanges();

      toggleOnlyShowSelected(fixture);

      let visibleCheckboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(visibleCheckboxesLength).toEqual(fixture.componentInstance.selectedItems.size);
    }));

    it('should hide the item if \'showOnlySelected\' property is set & user uncheck the checkbox', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      let checkboxes = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input');
      (checkboxes.item(0) as HTMLElement).click();
      tick();
      fixture.detectChanges();

      toggleOnlyShowSelected(fixture);

      checkboxes = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input');
      (checkboxes.item(0) as HTMLElement).click();
      tick();
      fixture.detectChanges();

      let visibleCheckboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(checkboxes.length).toBeGreaterThan(visibleCheckboxesLength);
    }));

    it('should handle items properly if \'showOnlySelected\' property is set & user clicks clear all & select all', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      toggleOnlyShowSelected(fixture);

      // check number of checkboxes visible when showOnlySection is selected.
      let checkboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;

      clickSelectAllButton(fixture);

      let updatedLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(checkboxesLength).toEqual(updatedLength);

      clickClearAllButton(fixture);

      updatedLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(updatedLength).toEqual(0);
    }));

    it('should show all items if \'showOnlySelected\' property is set & user change the mode to single', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      toggleOnlyShowSelected(fixture);

      component.selectMode = 'single';
      tick();
      fixture.detectChanges();

      // visible checkboxes when 'only show selected items' is hidden.
      let updatedCheckboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(updatedCheckboxesLength).toEqual(0);

      updatedCheckboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-list-view-checklist-item').length;
      expect(updatedCheckboxesLength).toBeGreaterThan(0);
    }));

    it('should hide all items if user clicks \'Show only selected\' option', fakeAsync(() => {
      component.showOnlySelected = false;
      tick();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let checkboxes = document.querySelectorAll('sky-checkbox input');
        (checkboxes.item(0) as HTMLElement).click();
        tick();
        fixture.detectChanges();

        let updatedCheckboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
        expect(updatedCheckboxesLength).toEqual(0);
      });
    }));

    it('should select all and clear all properly when not all items are displayed', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      tick();
      fixture.detectChanges();

      clickSelectAllButton(fixture);

      expect(component.selectedItems.get('1')).toBe(true);
      expect(component.selectedItems.get('2')).toBe(true);
      expect(component.selectedItems.get('3')).toBe(true);
      expect(component.selectedItems.get('4')).toBe(true);
      expect(component.selectedItems.get('5')).toBe(true);
      expect(component.selectedItems.get('6')).toBe(true);
      expect(component.selectedItems.get('7')).toBe(true);

      tick();
      fixture.detectChanges();
      let newItems = itemsArray.filter(item => item.id === '6' || item.id === '7');
      dispatcher.next(new ListItemsLoadAction(newItems, true));
      tick();
      fixture.detectChanges();

      tick();
      fixture.detectChanges();

      clickClearAllButton(fixture);

      expect(component.selectedItems.get('1')).toBe(true);
      expect(component.selectedItems.get('2')).toBe(true);
      expect(component.selectedItems.get('3')).toBe(true);
      expect(component.selectedItems.get('4')).toBe(true);
      expect(component.selectedItems.get('5')).toBe(true);
      expect(component.selectedItems.get('6')).toBe(false);
      expect(component.selectedItems.get('7')).toBe(false);

      clickSelectAllButton(fixture);

      expect(component.selectedItems.get('1')).toBe(true);
      expect(component.selectedItems.get('2')).toBe(true);
      expect(component.selectedItems.get('3')).toBe(true);
      expect(component.selectedItems.get('4')).toBe(true);
      expect(component.selectedItems.get('5')).toBe(true);
      expect(component.selectedItems.get('6')).toBe(true);
      expect(component.selectedItems.get('7')).toBe(true);

    }));

    it('sets toolbar type to search', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      state.take(1).subscribe((current) => {
        expect(current.toolbar.type).toBe('search');
      });
      tick();
      fixture.detectChanges();
    }));

    it(`should handle items properly if changeVisibleItems() is set to true,
        and selectAll() / clearAll() methods are hit (DEPRECATED)`, fakeAsync(() => {
      tick();
      fixture.detectChanges();

      component.changeVisibleItems(true);
      tick();
      fixture.detectChanges();

      // check number of checkboxes visible when showOnlySection is selected.
      let checkboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;

      component.selectAll();
      tick();
      fixture.detectChanges();

      let updatedLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(checkboxesLength).toEqual(updatedLength);

      component.clearAll();
      tick();
      fixture.detectChanges();

      updatedLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(updatedLength).toEqual(0);
    }));

  });

  describe('Models and State', () => {
    it('should create ListViewChecklistItemModel without data', () => {
      let model = new ListViewChecklistItemModel('123', true);
      expect(model.id).toBe('123');
      expect(model.description).toBeUndefined();
      expect(model.label).toBeUndefined();
    });

    it('should run ListViewChecklistItemsLoadAction action without refresh', async(() => {
      let checklistDispatcher = new ChecklistStateDispatcher();
      let checklistState = new ChecklistState(new ChecklistStateModel(), checklistDispatcher);
      let items = [
        new ListViewChecklistItemModel('1', false),
        new ListViewChecklistItemModel('2', false)
      ];

      checklistDispatcher.next(new ListViewChecklistItemsLoadAction());
      checklistDispatcher.next(new ListViewChecklistItemsLoadAction(items));
      checklistDispatcher.next(new ListViewChecklistItemsLoadAction(items, false, false));
      checklistState.subscribe(s => {
        expect(s.items.count).toBe(2);
      });
    }));
  });

  describe('Single select mode', () => {
    let dispatcher: ListStateDispatcher,
      state: ListState,
      bs: BehaviorSubject<Array<any>>,
      items: Observable<Array<any>>,
      fixture: ComponentFixture<ListViewChecklistToolbarTestComponent>,
      component: ListViewChecklistToolbarTestComponent;

    beforeEach(fakeAsync(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      bs = new BehaviorSubject<Array<any>>(itemsArray);
      items = bs.asObservable();

      TestBed.configureTestingModule({
        declarations: [
          ListViewChecklistToolbarTestComponent
        ],
        imports: [
          SkyListModule,
          SkyListToolbarModule,
          SkyListViewChecklistModule
        ],
        providers: [
          { provide: 'items', useValue: items }
        ]
      })
        .overrideComponent(SkyListComponent, {
          set: {
            providers: [
              { provide: ListState, useValue: state },
              { provide: ListStateDispatcher, useValue: dispatcher }
            ]
          }
        });

      fixture = TestBed.createComponent(ListViewChecklistToolbarTestComponent);
      component = fixture.componentInstance;
      component.selectMode = 'single';
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should hide the multiselect toolbar', fakeAsync(() => {
      expect(multiselectToolbarDefined()).toBe(false);
    }));

    it('should show single select buttons for each item', fakeAsync(() => {
      let singleSelectButtonsEl = getSingleSelectButtons();

      expect(singleSelectButtonsEl.length).toBe(11);
    }));

    it('should clear all but the current selection on single select button click', fakeAsync(() => {
      let singleSelectButtonsEl = getSingleSelectButtons();

      (singleSelectButtonsEl.item(1) as HTMLElement).click();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(component.selectedItems.get('1')).toBe(undefined);
      expect(component.selectedItems.get('2')).toBe(true);
      expect(component.selectedItems.get('3')).toBe(undefined);
      expect(component.selectedItems.get('4')).toBe(undefined);
      expect(component.selectedItems.get('5')).toBe(undefined);
      expect(component.selectedItems.get('6')).toBe(undefined);
      expect(component.selectedItems.get('7')).toBe(undefined);

      singleSelectButtonsEl = getSingleSelectButtons();

      (singleSelectButtonsEl.item(0) as HTMLElement).click();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(component.selectedItems.get('1')).toBe(true);
      expect(component.selectedItems.get('2')).toBe(undefined);
      expect(component.selectedItems.get('3')).toBe(undefined);
      expect(component.selectedItems.get('4')).toBe(undefined);
      expect(component.selectedItems.get('5')).toBe(undefined);
      expect(component.selectedItems.get('6')).toBe(undefined);
      expect(component.selectedItems.get('7')).toBe(undefined);
    }));
  });

  describe('Multiple select mode', () => {
    let dispatcher: ListStateDispatcher,
      state: ListState,
      bs: BehaviorSubject<Array<any>>,
      items: Observable<Array<any>>,
      fixture: ComponentFixture<ListViewChecklistToolbarTestComponent>,
      component: ListViewChecklistToolbarTestComponent;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      bs = new BehaviorSubject<Array<any>>(itemsArray);
      items = bs.asObservable();

      TestBed.configureTestingModule({
        declarations: [
          ListViewChecklistToolbarTestComponent
        ],
        imports: [
          SkyListModule,
          SkyListToolbarModule,
          SkyListViewChecklistModule
        ],
        providers: [
          { provide: 'items', useValue: items }
        ]
      })
        .overrideComponent(SkyListComponent, {
          set: {
            providers: [
              { provide: ListState, useValue: state },
              { provide: ListStateDispatcher, useValue: dispatcher }
            ]
          }
        });

      fixture = TestBed.createComponent(ListViewChecklistToolbarTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should default to multiple select mode, if none has been defined', fakeAsync(() => {
      expect(component.checklist.selectMode).toBe('multiple');
    }));

    it('should show the multiselect toolbar on load, if select mode has NOT been defined', fakeAsync(() => {
      expect(multiselectToolbarDefined()).toBe(true);
    }));

    it('should show the multiselect toolbar on load, if select mode HAS been defined', fakeAsync(() => {
      component.selectMode = 'multiple';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(multiselectToolbarDefined()).toBe(true);
    }));

    it('should hide the multiselect toolbar when switched to single select mode', fakeAsync(() => {
        component.selectMode = 'single';
        tick();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(multiselectToolbarDefined()).toBe(false);
    }));
  });
});

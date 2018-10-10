import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  ListItemModel,
  ListItemsLoadAction,
  ListState,
  ListStateDispatcher,
  ListViewsLoadAction,
  ListViewModel
} from '@skyux/list-builder/modules/list/state';

const moment = require('moment');
import {
  ListViewChecklistTestComponent
} from './fixtures/list-view-checklist.component.fixture';
import {
  ListViewChecklistEmptyTestComponent
} from './fixtures/list-view-checklist-empty.component.fixture';
import {
  ListViewChecklistToolbarTestComponent
} from './fixtures/list-view-checklist-toolbar.component.fixture';
import { SkyListViewChecklistModule } from './';
import { ListViewChecklistItemsLoadAction } from './state/items/actions';
import { ListViewChecklistItemModel } from './state/items/item.model';
import { ChecklistState, ChecklistStateDispatcher, ChecklistStateModel } from './state';

import {
  SkyListModule,
  SkyListComponent,
  SkyListToolbarModule
} from '@skyux/list-builder';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('List View Checklist Component', () => {
  describe('Basic Fixture', () => {
    let state: ListState,
      dispatcher: ListStateDispatcher,
      component: ListViewChecklistTestComponent,
      fixture: any,
      nativeElement: HTMLElement,
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
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      items = [
        new ListItemModel('1', {
          column1: '1', column2: 'Apple',
          column4: moment().add(1, 'minute')
        }),
        new ListItemModel('2', {
          column1: '01', column2: 'Banana',
          column4: moment().add(6, 'minute'), column5: 'test'
        }),
        new ListItemModel('3', {
          column1: '11', column2: 'Banana',
          column4: moment().add(4, 'minute')
        }),
        new ListItemModel('4', {
          column1: '12', column2: 'Daikon',
          column4: moment().add(2, 'minute')
        }),
        new ListItemModel('5', {
          column1: '13', column2: 'Edamame',
          column4: moment().add(5, 'minute')
        }),
        new ListItemModel('6', {
          column1: '20', column2: 'Fig',
          column4: moment().add(3, 'minute')
        }),
        new ListItemModel('7', {
          column1: '21', column2: 'Grape',
          column4: moment().add(7, 'minute')
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
      nativeElement: HTMLElement,
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
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      items = [
        new ListItemModel('1', {
          column1: '1', column2: 'Apple',
          column3: 1, column4: moment().add(1, 'minute')
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

  describe('Checklist with toolbar', () => {
    let dispatcher: ListStateDispatcher,
      state: ListState,
      bs: BehaviorSubject<Array<any>>,
      items: Observable<Array<any>>,
      fixture: ComponentFixture<ListViewChecklistToolbarTestComponent>,
      nativeElement: HTMLElement,
      element: DebugElement,
      component: ListViewChecklistToolbarTestComponent,
      itemsArray: Array<ListItemModel>;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      /* tslint:disable */
      itemsArray = [
        new ListItemModel('1', {
          column1: '1', column2: 'Apple',
          column4: moment().add(1, 'minute')
        }),
        new ListItemModel('2', {
          column1: '01', column2: 'Banana',
          column4: moment().add(6, 'minute'), column5: 'test'
        }),
        new ListItemModel('3', {
          column1: '11', column2: 'Banana',
          column4: moment().add(4, 'minute')
        }),
        new ListItemModel('4', {
          column1: '12', column2: 'Daikon',
          column4: moment().add(2, 'minute')
        }),
        new ListItemModel('5', {
          column1: '13', column2: 'Edamame',
          column4: moment().add(5, 'minute')
        }),
        new ListItemModel('6', {
          column1: '20', column2: 'Fig',
          column4: moment().add(3, 'minute')
        }),
        new ListItemModel('7', {
          column1: '21', column2: 'Grape',
          column4: moment().add(7, 'minute')
        })
      ];

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
        });;

      fixture = TestBed.createComponent(ListViewChecklistToolbarTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

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
      component.showOnlySelected = true;
      tick();
      fixture.detectChanges();

      component.showOnlySelected = false;
      tick();
      fixture.detectChanges();

      let visibleCheckboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(visibleCheckboxesLength).toEqual(7);
    }));

    it('should show selected items if \'showOnlySelected\' property is set', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      let checkboxes = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input');
      (checkboxes.item(0) as HTMLElement).click();
      tick();
      fixture.detectChanges();

      component.showOnlySelected = true;
      tick();
      fixture.detectChanges();

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

      component.showOnlySelected = true;
      tick();
      fixture.detectChanges();

      checkboxes = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input');
      (checkboxes.item(0) as HTMLElement).click();
      tick();
      fixture.detectChanges();

      let visibleCheckboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(checkboxes.length).toBeGreaterThan(visibleCheckboxesLength);
    }));

    it('should handle items properly if \'showOnlySelected\' property is set & user click clear all & select all link', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      let checkboxes = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input');
      (checkboxes.item(0) as HTMLElement).click();
      tick();
      fixture.detectChanges();

      component.showOnlySelected = true;
      tick();
      fixture.detectChanges();

      // check number of checkboxes visible when showOnlySection is selected.
      let checkboxesLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;

      let selectAllEl = <HTMLButtonElement>nativeElement
        .querySelector('.sky-list-view-checklist-select-all');

      selectAllEl.click();
      tick();
      fixture.detectChanges();

      let updatedLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(checkboxesLength).toEqual(updatedLength);

      let clearAllEl = <HTMLButtonElement>nativeElement
        .querySelector('.sky-list-view-checklist-clear-all');

      clearAllEl.click();
      tick();
      fixture.detectChanges();

      updatedLength = document.querySelectorAll('.sky-list-view-checklist sky-checkbox input').length;
      expect(updatedLength).toEqual(0);
    }));

    it('should show all items if \'showOnlySelected\' property is set & user change the mode to single', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      component.showOnlySelected = true;
      tick();
      fixture.detectChanges();

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

    it('should select all and clear all properly', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      let selectAllEl = <HTMLButtonElement>nativeElement
        .querySelector('.sky-list-view-checklist-select-all');

      let clearAllEl = <HTMLButtonElement>nativeElement
        .querySelector('.sky-list-view-checklist-clear-all');

      selectAllEl.click();
      tick();
      fixture.detectChanges();

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

      clearAllEl.click();
      tick();
      fixture.detectChanges();

      expect(component.selectedItems.get('1')).toBe(true);
      expect(component.selectedItems.get('2')).toBe(true);
      expect(component.selectedItems.get('3')).toBe(true);
      expect(component.selectedItems.get('4')).toBe(true);
      expect(component.selectedItems.get('5')).toBe(true);
      expect(component.selectedItems.get('6')).toBe(false);
      expect(component.selectedItems.get('7')).toBe(false);

      selectAllEl.click();
      tick();
      fixture.detectChanges();

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
      nativeElement: HTMLElement,
      element: DebugElement,
      component: ListViewChecklistToolbarTestComponent,
      itemsArray: Array<ListItemModel>;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      /* tslint:disable */
      itemsArray = [
        new ListItemModel('1', {
          column1: '1', column2: 'Apple',
          column4: moment().add(1, 'minute')
        }),
        new ListItemModel('2', {
          column1: '01', column2: 'Banana',
          column4: moment().add(6, 'minute'), column5: 'test'
        }),
        new ListItemModel('3', {
          column1: '11', column2: 'Banana',
          column4: moment().add(4, 'minute')
        }),
        new ListItemModel('4', {
          column1: '12', column2: 'Daikon',
          column4: moment().add(2, 'minute')
        }),
        new ListItemModel('5', {
          column1: '13', column2: 'Edamame',
          column4: moment().add(5, 'minute')
        }),
        new ListItemModel('6', {
          column1: '20', column2: 'Fig',
          column4: moment().add(3, 'minute')
        }),
        new ListItemModel('7', {
          column1: '21', column2: 'Grape',
          column4: moment().add(7, 'minute')
        })
      ];

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
        });;

      fixture = TestBed.createComponent(ListViewChecklistToolbarTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should hide the select all, clear all and show only selected buttons when switched to single select mode',
      fakeAsync(() => {

        tick();
        fixture.detectChanges();
        let selectAllEl = nativeElement
          .querySelector('.sky-list-view-checklist-select-all');

        let clearAllEl = nativeElement
          .querySelector('.sky-list-view-checklist-clear-all');

        let showOnlySelected = nativeElement
          .querySelector('.sky-toolbar-item sky-checkbox');

        expect(selectAllEl).not.toBeNull();
        expect(clearAllEl).not.toBeNull();
        expect(showOnlySelected).not.toBeNull();

        component.selectMode = 'single';
        tick();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        selectAllEl = nativeElement
          .querySelector('.sky-list-view-checklist-select-all');

        clearAllEl = nativeElement
          .querySelector('.sky-list-view-checklist-clear-all');

        showOnlySelected = nativeElement
          .querySelector('.sky-toolbar-item sky-checkbox');

        expect(selectAllEl).toBeNull();
        expect(clearAllEl).toBeNull();
        expect(showOnlySelected).toBeNull();

        let toolbarSectionsEl = nativeElement.querySelectorAll('sky-toolbar-section');
        expect((toolbarSectionsEl.item(1) as any).attributes['hidden']).not.toBeUndefined();

      }));

    it('should show the correct styles for single select mode selection', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      let singleSelectButtonsEl
        = nativeElement
          .querySelectorAll('.sky-list-view-checklist-item .sky-list-view-checklist-single-button');

      expect(singleSelectButtonsEl.length).toBe(0);

      component.selectMode = 'single';
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      singleSelectButtonsEl
        = nativeElement
          .querySelectorAll('.sky-list-view-checklist-item .sky-list-view-checklist-single-button');

      expect(singleSelectButtonsEl.length).toBe(7);
    }));

    it('should clear all but the current selection on single select button click', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      let singleSelectButtonsEl
        = nativeElement
          .querySelectorAll('.sky-list-view-checklist-item .sky-list-view-checklist-single-button');

      expect(singleSelectButtonsEl.length).toBe(0);

      component.selectMode = 'single';
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      singleSelectButtonsEl
        = nativeElement
          .querySelectorAll('.sky-list-view-checklist-item .sky-list-view-checklist-single-button');

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

      singleSelectButtonsEl
        = nativeElement
          .querySelectorAll('.sky-list-view-checklist-item .sky-list-view-checklist-single-button');

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
});

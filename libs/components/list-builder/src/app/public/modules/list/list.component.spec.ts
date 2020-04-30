import {
  DebugElement
} from '@angular/core';

import {
  TestBed,
  async,
  fakeAsync,
  tick,
  ComponentFixture
} from '@angular/core/testing';

import {
  FormsModule
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Observable
} from 'rxjs/Observable';

import {
  ListItemModel,
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import {
  ListPagingSetPageNumberAction,
  ListState,
  ListStateDispatcher,
  ListToolbarShowMultiselectToolbarAction
} from '../list/state';

import {
  ListDualTestComponent,
  ListEmptyTestComponent,
  ListFilteredTestComponent,
  ListFixturesModule,
  ListSelectedTestComponent,
  ListTestComponent,
  ListViewTestComponent
} from './fixtures';

import {
  ListDataRequestModel,
  ListDataResponseModel,
  SkyListComponent,
  SkyListModule
} from './';

import {
  SkyListToolbarModule
} from '../list-toolbar';

import {
  ListFilterModel,
  ListItemsSetSelectedAction,
  ListPagingModel,
  ListSearchModel,
  ListSearchSetFunctionsAction,
  ListSearchSetFieldSelectorsAction,
  ListSelectedSetItemsSelectedAction,
  ListSelectedSetItemSelectedAction,
  ListSortSetFieldSelectorsAction,
  ListSortLabelModel,
  ListToolbarItemModel,
  ListToolbarItemsLoadAction
} from './state';

import {
  SkyListInMemoryDataProvider
} from '../list-data-provider-in-memory';

describe('List Component', () => {
  describe('List Fixture', () => {

    function validateRowCount(element: DebugElement, expectedCount: number) {
      expect(element.queryAll(By.css('.list-view-test-item')).length).toBe(expectedCount);
    }

    describe('List Component with Observable', () => {
      let state: ListState,
          dispatcher: ListStateDispatcher,
          component: ListTestComponent,
          fixture: any,
          element: DebugElement,
          items: Observable<any>,
          bs: BehaviorSubject<any>;

      beforeEach(async(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        /* tslint:disable */
        let itemsArray = [
          { id: '1', column1: '30', column2: 'Apple',
            column3: 1, column4: 1 },
          { id: '2', column1: '01', column2: 'Banana',
            column3: 3, column4: 6 },
          { id: '3', column1: '11', column2: 'Banana',
            column3: 11, column4: 4 },
          { id: '4', column1: '12', column2: 'Carrot',
            column3: 12, column4: 2 },
          { id: '5', column1: '12', column2: 'Edamame',
            column3: 12, column4: 5 },
          { id: '6', column1: null, column2: null,
            column3: 20, column4: 3 },
          { id: '7', column1: '22', column2: 'Grape',
            column3: 21, column4: 7 }
        ];

        bs = new BehaviorSubject<Array<any>>(itemsArray);
        items = bs.asObservable();

        TestBed.configureTestingModule({
          imports: [
            ListFixturesModule,
            SkyListModule,
            SkyListToolbarModule,
            FormsModule
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

        fixture = TestBed.createComponent(ListTestComponent);
        element = fixture.debugElement as DebugElement;
        component = fixture.componentInstance;

      }));

      function initializeList() {
        fixture.detectChanges();

        // always skip the first update to ListState, when state is ready
        // run detectChanges once more then begin tests
        state.skip(1).take(1).subscribe(() => fixture.detectChanges());
        fixture.detectChanges();
      }

      function applySearch(value: string) {
        component.toolbar.searchComponent.applySearchText(value);
        fixture.detectChanges();
        return fixture.whenStable();
      }

      function validateRowValue(rowIndex: number, columnNumber: number, expectedValue: string) {
        const row = element.queryAll(By.css('.list-view-test-item'));

        const cell = row[rowIndex].query(By.css('.list-view-test-item-column' + columnNumber));

        expect(cell.nativeElement.innerText.trim()).toBe(expectedValue);
      }

      describe('basic actions', () => {
        beforeEach(async(() => {
          initializeList();
        }));

        it('should load data', () => {

          validateRowCount(element, 7);
        });

        it('should load new data', () => {
          validateRowCount(element, 7);
          fixture.detectChanges();
          bs.next([
            { id: '1', column1: '1', column2: 'Large',
              column3: 2, column4: 15 },
            { id: '2', column1: '22', column2: 'Small',
              column3: 3, column4: 60 },
            { id: '3', column1: '33', column2: 'Medium',
              column3: 4, column4: 45 }
          ]);
          fixture.detectChanges();
          validateRowCount(element, 3);
        });

        it('should update displayed items when data is updated', () => {
          let newItems = [
            { id: '11', column1: '11', column2: 'Coffee',
              column3: 11, column4: 11 },
            { id: '12', column1: '12', column2: 'Tea',
              column3: 12, column4: 12 }
          ];

          bs.next(newItems);
          fixture.detectChanges();

          validateRowCount(element, 2);
        });

        it('should search based on input text', async(() => {
          fixture.detectChanges();
          applySearch('banana').then(() => {

            fixture.detectChanges();
            validateRowCount(element, 2);

            applySearch('banana').then(() => {
              fixture.detectChanges();
              validateRowCount(element, 2);
            });
          });
        }));
      });

      describe('sorting', () => {
        it('should sort', fakeAsync(() => {
          initializeList();
          tick();
          validateRowCount(element, 7);
          dispatcher.next(new ListSortSetFieldSelectorsAction([
            {
              fieldSelector: 'column1',
              descending: true
            }
          ]));

          validateRowValue(0, 1, '30');
          fixture.detectChanges();

          dispatcher.next(new ListSortSetFieldSelectorsAction([
            {
              fieldSelector: 'column1',
              descending: false
            }
          ]));
          fixture.detectChanges();
          validateRowValue(0, 1, '01');
          fixture.detectChanges();
          dispatcher.next(new ListSortSetFieldSelectorsAction([
            {
              fieldSelector: 'column3',
              descending: true
            }
          ]));
          fixture.detectChanges();
          validateRowValue(0, 3, '21');
        }));

        it('should sort based on column using cached search', fakeAsync(() => {
          initializeList();
          tick();
          applySearch('banana')
          .then(() => {
            fixture.detectChanges();
            validateRowCount(element, 2);
            validateRowValue(0, 1, '01');

            dispatcher.next(new ListSortSetFieldSelectorsAction([
              {
                fieldSelector: 'column1',
                descending: true
              }
            ]));

            fixture.detectChanges();
            validateRowValue(0, 1, '11');
          });
        }));

        it('should set initial sort with non-array', fakeAsync(() => {
          component.sortFields = {
              fieldSelector: 'column3',
              descending: true
            };

          initializeList();
          tick();

          validateRowValue(0, 3, '21');
        }));

        it('should set initial sort with array', fakeAsync(() => {
          component.sortFields = [{
              fieldSelector: 'column3',
              descending: true
            }];

          initializeList();
          tick();

          validateRowValue(0, 3, '21');
        }));

      });

      describe('refreshDisplayedItems', () => {
        it('should refresh items', fakeAsync(() => {
          initializeList();
          tick();
          component.list.refreshDisplayedItems();
          fixture.detectChanges();
          validateRowCount(element, 7);
        }));
      });

      describe('itemCount', () => {
        it('should return item count', fakeAsync(() => {
          initializeList();
          tick();
          component.list.itemCount.take(1).subscribe(u => {
            state.take(1).subscribe((s) => {
              expect(u).toBe(s.items.count);
            });
          });
        }));
      });

      describe('lastUpdate', () => {
        it('should return last updated date', fakeAsync(() => {
          initializeList();
          tick();
          component.list.lastUpdate.take(1).subscribe(u => {
            state.take(1).subscribe((s) => {
              expect(u.getTime()).toEqual(s.items.lastUpdate)
            });
          });
        }));

        it('should return undefined if not defined', fakeAsync(() => {
          initializeList();
          tick();
          state.map((s) => s.items.lastUpdate = undefined).take(1).subscribe();
          component.list.lastUpdate.take(1).subscribe((u) => {
            expect(u).toBeUndefined();
          });
        }));
      });
    });

    describe('selected items', () => {
      let state: ListState,
          dispatcher: ListStateDispatcher,
          component: ListSelectedTestComponent,
          fixture: ComponentFixture<ListSelectedTestComponent>,
          items: Observable<any>,
          bs: BehaviorSubject<any>;

      beforeEach(async(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        /* tslint:disable */
        let itemsArray = [
          { id: '1', column1: '30', column2: 'Apple',
            column3: 1, column4: 1 },
          { id: '2', column1: '01', column2: 'Banana',
            column3: 3, column4: 6 },
          { id: '3', column1: '11', column2: 'Banana',
            column3: 11, column4: 4 },
          { id: '4', column1: '12', column2: 'Carrot',
            column3: 12, column4: 2 },
          { id: '5', column1: '12', column2: 'Edamame',
            column3: 12, column4: 5 },
          { id: '6', column1: null, column2: null,
            column3: 20, column4: 3 },
          { id: '7', column1: '22', column2: 'Grape',
            column3: 21, column4: 7 }
        ];

        bs = new BehaviorSubject<Array<any>>(itemsArray);
        items = bs.asObservable();

        TestBed.configureTestingModule({
          imports: [
            ListFixturesModule,
            SkyListModule,
            SkyListToolbarModule,
            FormsModule
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

        fixture = TestBed.createComponent(ListSelectedTestComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        // always skip the first update to ListState, when state is ready
        // run detectChanges once more then begin tests
        state.skip(1).take(1).subscribe(() => fixture.detectChanges());
        fixture.detectChanges();

      }));

      describe('models and actions', () => {
        it('should set items properly', fakeAsync(() => {
          dispatcher.next(new ListSelectedSetItemsSelectedAction(['1', '2'], true));

          tick();

          state.take(1).subscribe((current) => {
            const selectedIdMap = current.selected.item.selectedIdMap;
            expect(selectedIdMap.get('2')).toBe(true);
            expect(selectedIdMap.get('1')).toBe(true);
          });

          tick();

          dispatcher.next(new ListSelectedSetItemsSelectedAction(['1'], false, false));

          tick();

          state.take(1).subscribe((current) => {
            const selectedIdMap = current.selected.item.selectedIdMap;
            expect(selectedIdMap.get('2')).toBe(true);
            expect(selectedIdMap.get('1')).toBe(false);
          });

          tick();

          dispatcher.next(new ListSelectedSetItemsSelectedAction(['3'], true, true));

          tick();

          state.take(1).subscribe((current) => {
            const selectedIdMap = current.selected.item.selectedIdMap;
            expect(selectedIdMap.get('2')).toBe(undefined);
            expect(selectedIdMap.get('3')).toBe(true);
          });

          tick();

        }));

        it('should set item properly', fakeAsync(() => {
          dispatcher.next(new ListSelectedSetItemSelectedAction('1', true));

          tick();

          state.take(1).subscribe((current) => {
            const selectedIdMap = current.selected.item.selectedIdMap;
            expect(selectedIdMap.get('1')).toBe(true);
          });

          tick();

          dispatcher.next(new ListSelectedSetItemSelectedAction('2', true));

          tick();

          state.take(1).subscribe((current) => {
            const selectedIdMap = current.selected.item.selectedIdMap;
            expect(selectedIdMap.get('2')).toBe(true);
            expect(selectedIdMap.get('1')).toBe(true);
          });

          tick();

          dispatcher.next(new ListSelectedSetItemSelectedAction('1', false));

          tick();

          state.take(1).subscribe((current) => {
            const selectedIdMap = current.selected.item.selectedIdMap;
            expect(selectedIdMap.get('2')).toBe(true);
            expect(selectedIdMap.get('1')).toBe(false);
          });

          tick();
        }));
      });

      it('should allow users to initialize selectedIds', fakeAsync(() => {

        tick();
        fixture.detectChanges();
        state.take(1).subscribe((current) => {
          const selectedIdMap = current.selected.item.selectedIdMap;
          expect(selectedIdMap.get('2')).toBe(true);
          expect(selectedIdMap.get('1')).toBe(true);
        });

        fixture.detectChanges();
        tick();
      }));

      it('should allow users to change selectedIds', fakeAsync(() => {
        tick();
        fixture.detectChanges();

        component.selectedIds = ['3', '4']
        tick();
        fixture.detectChanges();
        state.take(1).subscribe((current) => {
          const selectedIdMap = current.selected.item.selectedIdMap;
          expect(selectedIdMap.get('1')).toBeUndefined();
          expect(selectedIdMap.get('2')).toBeUndefined();
          expect(selectedIdMap.get('3')).toBe(true);
          expect(selectedIdMap.get('4')).toBe(true);
          expect(selectedIdMap.get('5')).toBeUndefined();
          expect(selectedIdMap.get('6')).toBeUndefined();
          expect(selectedIdMap.get('7')).toBeUndefined();
        });

        component.selectedIds = []
        tick();
        fixture.detectChanges();
        state.take(1).subscribe((current) => {
          const selectedIdMap = current.selected.item.selectedIdMap;
          expect(selectedIdMap.get('1')).toBeUndefined();
          expect(selectedIdMap.get('2')).toBeUndefined();
          expect(selectedIdMap.get('3')).toBeUndefined();
          expect(selectedIdMap.get('4')).toBeUndefined();
          expect(selectedIdMap.get('5')).toBeUndefined();
          expect(selectedIdMap.get('6')).toBeUndefined();
          expect(selectedIdMap.get('7')).toBeUndefined();
        });

        fixture.detectChanges();
        tick();
      }));

      it('should not change selectedIds if the values are not distinct', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        const dispatcherSpy = spyOn(dispatcher, 'setSelected').and.callThrough();

        component.selectedIds = ['3', '4']
        tick();
        fixture.detectChanges();
        expect(dispatcherSpy).toHaveBeenCalledTimes(1);
        dispatcherSpy.calls.reset();

        component.selectedIds = ['3', '4']
        tick();
        fixture.detectChanges();
        expect(dispatcherSpy).not.toHaveBeenCalled();

        fixture.detectChanges();
        tick();
      }));

      it('should handle an undefined value for selectedIds', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        const dispatcherSpy = spyOn(dispatcher, 'setSelected').and.callThrough();

        component.selectedIds = ['3', '4']
        tick();
        fixture.detectChanges();
        expect(dispatcherSpy).toHaveBeenCalledTimes(1);
        dispatcherSpy.calls.reset();

        component.selectedIds = undefined
        tick();
        fixture.detectChanges();
        expect(dispatcherSpy).toHaveBeenCalledTimes(1);
        state.take(1).subscribe((current) => {
          const selectedIdMap = current.selected.item.selectedIdMap;
          expect(selectedIdMap.get('1')).toBeUndefined();
          expect(selectedIdMap.get('2')).toBeUndefined();
          expect(selectedIdMap.get('3')).toBeUndefined();
          expect(selectedIdMap.get('4')).toBeUndefined();
          expect(selectedIdMap.get('5')).toBeUndefined();
          expect(selectedIdMap.get('6')).toBeUndefined();
          expect(selectedIdMap.get('7')).toBeUndefined();
        });

        fixture.detectChanges();
        tick();
      }));

      it('should allow users to access displayed selectedItems', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        component.list.selectedItems.subscribe((items)=> {
          expect(items[0].data.column2).toBe('Apple');
          expect(items[1].data.column2).toBe('Banana');
        });

        fixture.detectChanges();
        tick();
      }));

      it('should allow users to listen for selectedId changes on an event', fakeAsync(() => {
        tick();
        fixture.detectChanges();

        dispatcher.next(new ListSelectedSetItemsSelectedAction(['1', '2'], true));

        tick();

        fixture.detectChanges();
        let selectedIds: Array<string> = Array.from(component.selectedItems.entries())
          .filter((item) => item[1])
          .map((item) => item[0]);

        expect(selectedIds[0]).toBe('1');
        expect(selectedIds[1]).toBe('2');
      }));

      it('should retain selections after applying/removing filters', fakeAsync(() => {
        const filters = [
          new ListFilterModel({
            name: 'show-selected'
          })
        ];

        // Select rows and apply "Show only selected" filter.
        dispatcher.setSelected(['1','2'], true);
        dispatcher.filtersUpdate(filters);
        fixture.detectChanges();

        // Expect rows to still be selected.
        component.list.selectedItems.take(1).subscribe((items)=> {
          expect(items.length === 2);
          expect(items[0].data.column2).toBe('Apple');
          expect(items[1].data.column2).toBe('Banana');
        });

        // Change selections and disable the "Show only selected" filter.
        dispatcher.setSelected(['4'], true);
        dispatcher.filtersUpdate([]);
        fixture.detectChanges();

        // Expect new rows to be selected.
        component.list.selectedItems.take(1).subscribe((items)=> {
          expect(items.length === 2);
          expect(items[0].data.column2).toBe('Apple');
          expect(items[1].data.column2).toBe('Banana');
          expect(items[2].data.column2).toBe('Carrot');
        });

      }));

      it('should properly retain selections and update item.isSelected after selecting and clearing all, then updating the filters', fakeAsync(() => {
        // Simulate 'select all' click.
        dispatcher.setSelected(['1','2','3','4','5','6','7'], true);
        fixture.detectChanges();

        // Apply "Show only selected" filter.
        const filters = [
          new ListFilterModel({
            name: 'show-selected'
          })
        ];
        dispatcher.filtersUpdate(filters);
        fixture.detectChanges();

        // Expect all rows to be selected.
        state.map(s => s.items.items).take(1).subscribe((items)=> {
          items.forEach(i => {
            expect(i.isSelected).toEqual(true);
          });
        });

        // Simulate 'clear all' click.
        dispatcher.setSelected(['1','2','3','4','5','6','7'], false);
        fixture.detectChanges();

        // Disable the "Show only selected" filter.
        dispatcher.filtersUpdate([]);
        fixture.detectChanges();

        // Expect no rows to be selected.
        state.map(s => s.items.items).take(1).subscribe((items)=> {
          items.forEach(i => {
            expect(i.isSelected).toEqual(false);
          });
        });
      }));
    });

    describe('filtering', () => {
       let state: ListState,
          dispatcher: ListStateDispatcher,
          component: ListFilteredTestComponent,
          fixture: ComponentFixture<ListFilteredTestComponent>,
          items: Observable<any>,
          bs: BehaviorSubject<any>;

      beforeEach(async(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        /* tslint:disable */
        let itemsArray = [
          { id: '1', column1: '30', column2: 'Apple',
            column3: 1, column4: 1 },
          { id: '2', column1: '01', column2: 'Banana',
            column3: 3, column4: 6 },
          { id: '3', column1: '11', column2: 'Banana',
            column3: 11, column4: 4 },
          { id: '4', column1: '12', column2: 'Carrot',
            column3: 12, column4: 2 },
          { id: '5', column1: '12', column2: 'Edamame',
            column3: 12, column4: 5 },
          { id: '6', column1: null, column2: null,
            column3: 20, column4: 3 },
          { id: '7', column1: '22', column2: 'Grape',
            column3: 21, column4: 7 }
        ];

        bs = new BehaviorSubject<Array<any>>(itemsArray);
        items = bs.asObservable();

        TestBed.configureTestingModule({
          imports: [
            ListFixturesModule,
            SkyListModule,
            SkyListToolbarModule,
            FormsModule
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

        fixture = TestBed.createComponent(ListFilteredTestComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        // always skip the first update to ListState, when state is ready
        // run detectChanges once more then begin tests
        state.skip(1).take(1).subscribe(() => fixture.detectChanges());
        fixture.detectChanges();

      }));

      function appleFilterFunction(item: ListItemModel, filterValue: any) {
        return item.data.column2 === filterValue;
      }

      it('should filter when input is changed', fakeAsync(() => {
        let appliedFilters = [
          new ListFilterModel({
            name: 'filter1',
            value: 'Apple',
            filterFunction: appleFilterFunction
          })
        ];

        component.listFilters = appliedFilters;
        fixture.detectChanges();
        tick();
        state.take(1).subscribe((current) => {
          expect(current.filters.length).toBe(1);
          expect(current.items.items.length).toBe(1);
        });
        tick();
      }));

      it('should return the list to page 1 when filters are changed', fakeAsync(() => {
        dispatcher.next(
          new ListPagingSetPageNumberAction(Number(2))
        );
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        state.take(1).subscribe((current) => {
          expect(current.filters.length).toBe(0);
          expect(current.items.items.length).toBe(7);
          expect(current.paging.pageNumber).toBe(2);
        });

        let appliedFilters = [
          new ListFilterModel({
            name: 'filter1',
            value: 'Apple',
            filterFunction: appleFilterFunction
          })
        ];

        component.listFilters = appliedFilters;
        fixture.detectChanges();
        tick();
        state.take(1).subscribe((current) => {
          expect(current.filters.length).toBe(1);
          expect(current.items.items.length).toBe(1);
          expect(current.paging.pageNumber).toBe(1);
        });
        tick();
      }));

      it('should output event when filters are changed and output listener exists', fakeAsync(() => {
        let appliedFilters = [
          new ListFilterModel({
            name: 'filter1',
            value: 'Apple',
            filterFunction: appleFilterFunction
          })
        ];
        spyOn(component.list.appliedFiltersChange, 'emit').and.callThrough();
        dispatcher.filtersUpdate(appliedFilters);
        fixture.detectChanges()
        tick();
        fixture.detectChanges();

        expect(component.appliedFilters).toEqual(appliedFilters);
        expect(component.list.appliedFiltersChange.emit).toHaveBeenCalledTimes(1);

        fixture.nativeElement.querySelector('sky-filter-summary-item .sky-token-btn-close').click();
        fixture.detectChanges()
        tick();
        fixture.detectChanges();

        expect(component.appliedFilters).toEqual([]);
        expect(component.list.appliedFiltersChange.emit).toHaveBeenCalledTimes(2);
      }));

      describe('models and state', () => {
        it('should handle no data passed to constructor', () => {
          new ListFilterModel();
        });
      });
    });

    describe('List Component with Array', () => {
      let state: ListState,
          dispatcher: ListStateDispatcher,
          fixture: any,
          element: DebugElement;

      beforeEach(async(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        let items = [
          { id: '1', column1: '1', column2: 'Apple',
            column3: 1, column4: 1 },
          { id: '2', column1: '01', column2: 'Banana',
            column3: 1, column4: 6 },
          { id: '3', column1: '11', column2: 'Carrot',
            column3: 11, column4: 4 },
          { id: '4', column1: '12', column2: 'Daikon',
            column3: 12, column4: 2 },
          { id: '5', column1: '13', column2: 'Edamame',
            column3: 13, column4: 5 },
          { id: '6', column1: '20', column2: 'Fig',
            column3: 20, column4: 3 },
          { id: '7', column1: '21', column2: 'Grape',
            column3: 21, column4: 7 }
        ];

        TestBed.configureTestingModule({
          imports: [
            ListFixturesModule,
            SkyListModule,
            SkyListToolbarModule,
            FormsModule
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

        fixture = TestBed.createComponent(ListTestComponent);
        element = fixture.debugElement as DebugElement;
        fixture.detectChanges();

        // always skip the first update to ListState, when state is ready
        // run detectChanges once more then begin tests
        state.skip(1).take(1).subscribe(() => fixture.detectChanges());
        fixture.detectChanges();
      }));

      it('should load data', () => {
        validateRowCount(element, 7);
      });
    });
  });

  describe('Empty List Fixture', () => {
    describe('List Component with Observable', () => {
      let state: ListState,
          dispatcher: ListStateDispatcher,
          fixture: any,
          dataProvider: SkyListInMemoryDataProvider,
          element: DebugElement,
          items: Observable<any>,
          bs: BehaviorSubject<any>;

      beforeEach(async(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        let itemsArray = [
          { id: '1', column1: '1', column2: 'Apple',
            column3: 1, column4: 1 },
          { id: '2', column1: '01', column2: 'Banana',
            column3: 1, column4: 6 }
        ];

        bs = new BehaviorSubject<Array<any>>(itemsArray);
        items = bs.asObservable();
        dataProvider = new SkyListInMemoryDataProvider(items);

        TestBed.configureTestingModule({
          imports: [
            ListFixturesModule,
            SkyListModule,
            SkyListToolbarModule,
            FormsModule
          ],
          providers: [
            { provide: 'items', useValue: items },
            { provide: SkyListInMemoryDataProvider, useValue: dataProvider }
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

        fixture = TestBed.createComponent(ListEmptyTestComponent);
        element = fixture.debugElement as DebugElement;
        fixture.detectChanges();

        // always skip the first update to ListState, when state is ready
        // run detectChanges once more then begin tests
        state.skip(1).take(1).subscribe(() => fixture.detectChanges());
        fixture.detectChanges();
      }));

      it('should be empty', () => {
        expect(element.queryAll(By.css('tr.sky-grid-row')).length).toBe(0);
      });

      it('displayed items returns without error', async(() => {
        let list = fixture.componentInstance.list;

        list.displayedItems.subscribe((d: any) => {
          expect(d.count).toBe(2);
          expect(d.items.length).toBe(2);
        });

        expect(list.displayedItems).not.toBe(null);
      }));

      it('displayed items returns with generated ids', async(() => {
        let list = fixture.componentInstance.list;

        bs.next([
          { column1: '1', column2: 'Apple',
            column3: 1, column4: 1 },
          { column1: '01', column2: 'Banana',
            column3: 1, column4: 6 }
        ]);
        fixture.detectChanges();

        list.displayedItems.subscribe((d: any) => {
          expect(d.count).toBe(2);
          expect(d.items.length).toBe(2);
          expect(d.items[0].id).not.toBe(1);
           expect(d.items[1].id).not.toBe(2);
        });

        expect(list.displayedItems).not.toBe(null);
      }));

      it('data provider filteredItems with no search function', () => {
        let provider = fixture.componentInstance.list.dataProvider;
        let request = new ListDataRequestModel({
          pageSize: 10,
          pageNumber: 1,
          search: new ListSearchModel(),

        });

        let response = provider.get(request);
        response.take(1).subscribe();
        response.take(1).subscribe((r: any) => expect(r.count).toBe(2));

      });

      it('data provider filteredItems with defined search function', () => {
        let provider = fixture.componentInstance.list.dataProvider;
        provider.searchFunction = (data: any, searchText: string) => { return 'search'; }

        let request = new ListDataRequestModel({
          pageSize: 10,
         pageNumber: 1,
         search: new ListSearchModel({ searchText: 'search', functions: [() => {}] }),
        });

        let response = provider.get(request);
        response.take(1).subscribe((r: any) => expect(r.count).toBe(2));

      });
    });

    describe('List Component with no data', () => {
      let state: ListState,
          dispatcher: ListStateDispatcher,
          fixture: any,
          dataProvider: SkyListInMemoryDataProvider;

      beforeEach(async(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);
        dataProvider = new SkyListInMemoryDataProvider();

        TestBed.configureTestingModule({
          imports: [
            ListFixturesModule,
            SkyListModule,
            SkyListToolbarModule,
            FormsModule
          ],
          providers: [
            { provide: 'items', useValue: null },
            { provide: SkyListInMemoryDataProvider, useValue: dataProvider }
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

        fixture = TestBed.createComponent(ListEmptyTestComponent);
        fixture.detectChanges();

        // always skip the first update to ListState, when state is ready
        // run detectChanges once more then begin tests
        state.skip(1).take(1).subscribe(() => fixture.detectChanges());
        fixture.detectChanges();
      }));

      it('data provider should not be null even with no data', () => {
        let list = fixture.componentInstance.list;

        expect(list.data).toBe(null);
        expect(list.dataProvider).not.toBe(null);

        list.dataProvider.count()
          .take(1)
          .subscribe((count: any) => {
            expect(count).toBe(0);
        });
      });
    });

    describe('List Component with no data and no data provider', () => {
      let state: ListState,
          dispatcher: ListStateDispatcher,
          fixture: any;

      beforeEach(async(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        TestBed.configureTestingModule({
          imports: [
            ListFixturesModule,
            SkyListModule,
            SkyListToolbarModule,
            FormsModule
          ],
          providers: [
            { provide: 'items', useValue: null },
            { provide: SkyListInMemoryDataProvider, useValue: null }
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

        fixture = TestBed.createComponent(ListEmptyTestComponent);
        fixture.detectChanges();

        // always skip the first update to ListState, when state is ready
        // run detectChanges once more then begin tests
        state.skip(1).take(1).subscribe(() => fixture.detectChanges());
        fixture.detectChanges();
      }));

      it('displayed items should throw error', () => {
        let list = fixture.componentInstance.list;
        try {
          list.displayedItems;
        } catch (error) {
          expect(error.message).toBe('List requires data or dataProvider to be set.');
        }
      });
    });
  });

  describe('Dual view Fixture', () => {
    describe('List Component with Observable', () => {
      let state: ListState,
          dispatcher: ListStateDispatcher,
          component: ListTestComponent,
          fixture: any,
          element: DebugElement,
          items: Observable<any>,
          bs: BehaviorSubject<any>;

      beforeEach(async(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        /* tslint:disable */
        let itemsArray = [
          { id: '1', column1: '30', column2: 'Apple',
            column3: 1, column4: 1 },
          { id: '2', column1: '01', column2: 'Banana',
            column3: 3, column4: 6 },
          { id: '3', column1: '11', column2: 'Banana',
            column3: 11, column4: 4 },
          { id: '4', column1: '12', column2: 'Carrot',
            column3: 12, column4: 2 },
          { id: '5', column1: '12', column2: 'Edamame',
            column3: 12, column4: 5 },
          { id: '6', column1: null, column2: null,
            column3: 20, column4: 3 },
          { id: '7', column1: '22', column2: 'Grape',
            column3: 21, column4: 7 }
        ];

        bs = new BehaviorSubject<Array<any>>(itemsArray);
        items = bs.asObservable();

        TestBed.configureTestingModule({
          imports: [
            ListFixturesModule,
            SkyListModule,
            SkyListToolbarModule,
            FormsModule
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

        fixture = TestBed.createComponent(ListDualTestComponent);
        element = fixture.debugElement as DebugElement;
        component = fixture.componentInstance;
        fixture.detectChanges();

        // always skip the first update to ListState, when state is ready
        // run detectChanges once more then begin tests
        state.skip(1).take(1).subscribe(() => fixture.detectChanges());
        fixture.detectChanges();
      }));

      it('should switch views when setting view active', () => {
        fixture.detectChanges();
        expect(element.queryAll(
          By.css('sky-list-view-test[ng-reflect-name="First"] .list-view-test-item')
        ).length).toBe(7);
        dispatcher.viewsSetActive(component.list.views[1].id);

        fixture.detectChanges();

        expect(element.queryAll(
          By.css('sky-list-view-test[ng-reflect-name="Second"] .list-view-test-item')
        ).length).toBe(7);

      });

      it('should return list of views', () => {
        expect(component.list.views.length).toBe(2);
        expect(component.list.views[0] instanceof ListViewTestComponent).toBeTruthy();
        expect(component.list.views[0].label).toBe('First');
        expect(component.list.views[1] instanceof ListViewTestComponent).toBeTruthy();
        expect(component.list.views[1].label).toBe('Second');
      });
    });
  });

  describe('models and actions', () => {
    it('should handle undefined data for request model', () => {
      let model = new ListDataRequestModel();
      expect(model.pageNumber).toBeUndefined();
      expect(model.pageSize).toBeUndefined();
    });

    it('should handle missing data for paging model', () => {
      let model = new ListPagingModel({});
      expect(model.pageNumber).toBe(1);
      expect(model.itemsPerPage).toBe(10);
    });

    it('should handle undefined data for response model', () => {
      let model = new ListDataResponseModel();
      expect(model.count).toBe(undefined);
      expect(model.items).toBe(undefined);
    });

    it('should construct ListSearchSetFunctionsAction', () => {
      let action = new ListSearchSetFunctionsAction();
      expect(action).not.toBeUndefined();
    });

    it('should construct ListSearchSetFieldSelectorsAction', () => {
      let action = new ListSearchSetFieldSelectorsAction();
      expect(action).not.toBeUndefined();
    });

    it('should construct ListToolbarItemModel without data', () => {
      let model = new ListToolbarItemModel();
      expect(model.template).toBeUndefined();
      expect(model.location).toBeUndefined();
      expect(model.view).toBeUndefined();
      expect(model.id).toBeUndefined();
    });

    it('should construct ListToolbarItemsLoadAction action', async(() => {
      let action = new ListToolbarItemsLoadAction([new ListToolbarItemModel()]);
      expect(action).not.toBeUndefined();
    }));

    describe('list load search options action', () => {
      let dispatcher: ListStateDispatcher;
      let state: ListState;

      beforeEach(fakeAsync(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        state.skip(1).take(1).subscribe(() => tick());
        tick();
      }));

      it('should call searchSetOptions with undefined parameters', fakeAsync(() => {
        dispatcher.searchSetOptions(new ListSearchModel());

        state.map(s => s.search).take(1).subscribe(search => {
          expect(search.searchText).toBe('');
          expect(search.functions.length).toBe(0);
          expect(search.fieldSelectors.length).toBe(0);
        });
      }));

      it('should call searchSetOptions with defined actions', fakeAsync(() => {
        let searchFunc = (data: any, searchText: string) => {return true;}

        dispatcher.searchSetOptions(new ListSearchModel({
          searchText: 'search text',
          functions: [searchFunc],
          fieldSelectors: ['fields']
        }));

        state.map(s => s.search).take(1).subscribe(search => {
          expect(search.searchText).toBe('search text');
          expect(search.functions.length).toBe(1);
          expect(search.fieldSelectors.length).toBe(1);
        });
      }));
    });

    describe('toolbar load action', () => {
      let dispatcher: ListStateDispatcher;
      let state: ListState;

      beforeEach(fakeAsync(() => {
        dispatcher = new ListStateDispatcher();
        state = new ListState(dispatcher);

        state.skip(1).take(1).subscribe(() => tick());
        tick();
      }));

      it('should handle index of -1 or greater than current length', fakeAsync(() => {

        let newItems: ListToolbarItemModel[] = [
          new ListToolbarItemModel({
            id: '0'
          }),
          new ListToolbarItemModel({
            id: '2'
          })
        ];
        dispatcher.toolbarAddItems(newItems, -1);

        tick();

        state.take(1).subscribe((current) => {
          expect(current.toolbar.items.length).toBe(2);
        });

        tick();

        newItems = [
          new ListToolbarItemModel({
            id: 'blue'
          })
        ];

        dispatcher.toolbarAddItems(newItems, 6);

        tick();

        state.take(1).subscribe((current) => {
          expect(current.toolbar.items[2].id).toBe('blue');
        });

        tick();

      }));

      it('should handle index of 0', fakeAsync(() => {

        let newItems: ListToolbarItemModel[] = [
          new ListToolbarItemModel({
            id: '0'
          }),
          new ListToolbarItemModel({
            id: '2'
          })
        ];
        dispatcher.toolbarAddItems(newItems, -1);

        tick();

        newItems = [
          new ListToolbarItemModel({
            id: 'blue'
          })
        ];

        dispatcher.toolbarAddItems(newItems, 0);

        tick();

        state.take(1).subscribe((current) => {
          expect(current.toolbar.items[0].id).toBe('blue');
        });

        tick();
      }));

      it('should handle index of less than current length', fakeAsync(() => {

        let newItems: ListToolbarItemModel[] = [
          new ListToolbarItemModel({
            id: '0'
          }),
          new ListToolbarItemModel({
            id: '2'
          })
        ];
        dispatcher.toolbarAddItems(newItems, -1);

        tick();

        newItems = [
          new ListToolbarItemModel({
            id: 'blue'
          })
        ];

        dispatcher.toolbarAddItems(newItems, 1);

        tick();

        state.take(1).subscribe((current) => {
          expect(current.toolbar.items[1].id).toBe('blue');
        });

        tick();
      }));
    });

    it('should construct ListSelectedSetItemsSelectedAction', () => {
      let action = new ListSelectedSetItemsSelectedAction(['1']);
      expect(action).not.toBeUndefined();
    });

    it('should construct ListItemsSetSelectedAction', () => {
      let action = new ListItemsSetSelectedAction(['1'], true);
      expect(action).not.toBeUndefined();
    });

    it('should construct ListToolbarShowMultiselectToolbarAction', () => {
      let action = new ListToolbarShowMultiselectToolbarAction(true);
      expect(action).not.toBeUndefined();
    });

    it('should construct ListSortFieldSelectorModel without data', () => {
      let model = new ListSortFieldSelectorModel();
      expect(model.descending).toBeFalsy();
      expect(model.fieldSelector).toBeUndefined();
    });

    it('should construct ListSortFieldSelectorModel without data', () => {
      let model = new ListSortFieldSelectorModel({
        fieldSelector: 'hey',
        descending: true
      });
      expect(model.descending).toBe(true);
      expect(model.fieldSelector).toBe('hey');
    });

    it('should construct ListSortLabelModel without data', () => {
      let model = new ListSortLabelModel();
      expect(model.global).toBeFalsy();
      expect(model.text).toBeUndefined();
      expect(model.fieldSelector).toBeUndefined();
      expect(model.fieldType).toBeUndefined();
   });
  });

});

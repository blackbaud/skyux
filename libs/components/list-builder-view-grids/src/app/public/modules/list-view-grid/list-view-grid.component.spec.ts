import {
  TestBed,
  async,
  fakeAsync,
  flush,
  tick,
  ComponentFixture
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  ListState,
  ListStateDispatcher,
  ListViewsLoadAction,
  ListViewModel,
  ListItemsLoadAction
} from '@skyux/list-builder/modules/list/state';

import {
  SkyGridColumnModel
} from '@skyux/grids/modules/grid/grid-column.model';

import {
  SkyListComponent
} from '@skyux/list-builder/modules/list/list.component';

import {
  ListItemModel
} from '@skyux/list-builder-common';

const moment = require('moment');

import {
  ListViewGridFixturesModule
} from './fixtures/list-view-grid-fixtures.module';

import {
  ListViewGridTestComponent
} from './fixtures/list-view-grid.component.fixture';

import {
  ListViewGridDynamicTestComponent
} from './fixtures/list-view-grid-dynamic.component.fixture';

import {
  ListViewGridDisplayTestComponent
} from './fixtures/list-view-grid-display.component.fixture';

import {
  ListViewGridEmptyTestComponent
} from './fixtures/list-view-grid-empty.component.fixture';

import {
  ListViewGridColumnsLoadAction
} from './state/columns/actions';

import {
  ListViewDisplayedGridColumnsLoadAction
} from './state/displayed-columns/actions';

import {
  GridState,
  GridStateDispatcher,
  GridStateModel
} from './state';

describe('List View Grid Component', () => {
  describe('Basic Fixture', () => {
    let state: ListState,
        dispatcher: ListStateDispatcher,
        component: ListViewGridTestComponent,
        fixture: ComponentFixture<ListViewGridTestComponent>,
        nativeElement: HTMLElement,
        element: DebugElement;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        imports: [
          ListViewGridFixturesModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher }
        ]
      });

      fixture = TestBed.createComponent(ListViewGridTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
    }));

    function setupTest() {
      fixture.detectChanges();

      let items = [
        new ListItemModel('1', { column1: '1', column2: 'Apple',
          column3: 1, column4: moment().add(1, 'minute') }),
        new ListItemModel('2', { column1: '01', column2: 'Banana',
          column3: 1, column4: moment().add(6, 'minute'), column5: 'test' }),
        new ListItemModel('3', { column1: '11', column2: 'Carrot',
          column3: 11, column4: moment().add(4, 'minute') }),
        new ListItemModel('4', { column1: '12', column2: 'Daikon',
          column3: 12, column4: moment().add(2, 'minute') }),
        new ListItemModel('5', { column1: '13', column2: 'Edamame',
          column3: 13, column4: moment().add(5, 'minute') }),
        new ListItemModel('6', { column1: '20', column2: 'Fig',
          column3: 20, column4: moment().add(3, 'minute') }),
        new ListItemModel('7', { column1: '21', column2: 'Grape',
          column3: 21, column4: moment().add(7, 'minute') })
      ];

      dispatcher.next(new ListItemsLoadAction(items, true));
      dispatcher.next(new ListViewsLoadAction([
        new ListViewModel(component.grid.id, component.grid.label)
      ]));
      dispatcher.viewsSetActive(component.grid.id);
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }

    describe('standard setup', () => {
      it('should show 6 columns', fakeAsync(() => {
        setupTest();
        flush();
        tick(110); // wait for async heading
        fixture.detectChanges();

        expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(5);
        expect(element.query(
          By.css('th[sky-cmp-id="column1"]')
        ).nativeElement.textContent.trim()).toBe('Column1');
        expect(element.query(
          By.css('th[sky-cmp-id="column2"]')
        ).nativeElement.textContent.trim()).toBe('Column2');
        expect(element.query(
          By.css('th[sky-cmp-id="column3"]')
        ).nativeElement.textContent.trim()).toBe('Column3');
        expect(element.query(
          By.css('th[sky-cmp-id="column4"]')
        ).nativeElement.textContent.trim()).toBe('Column4');
        expect(element.query(
          By.css('th[sky-cmp-id="column5"]')
        ).nativeElement.textContent.trim()).toBe('Column5');
      }));

      it('should listen for the selectedColumnIdsChanged event and update the columns accordingly',
        (done) => {
          setupTest();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            component.grid.selectedColumnIdsChange.subscribe((newColumnIds: string[]) => {
              expect(newColumnIds).toEqual(['column1', 'column2']);
              done();
            });

            component.grid.gridComponent.selectedColumnIdsChange.emit(['column1', 'column2']);
            fixture.detectChanges();
            expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
            expect(element.query(
              By.css('th[sky-cmp-id="column1"]')
            ).nativeElement.textContent.trim()).toBe('Column1');
            expect(element.query(
              By.css('th[sky-cmp-id="column2"]')
            ).nativeElement.textContent.trim()).toBe('Column2');
          });
        }
      );

      it('should listen for the sortFieldChange event', fakeAsync(() => {
        setupTest();
        tick(110); // wait for async heading
        let headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
        SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup');
        fixture.detectChanges();

        tick();

        state.take(1).subscribe((s) => {
          expect(s.sort.fieldSelectors[0].fieldSelector).toBe('column1');
          expect(s.sort.fieldSelectors[0].descending).toBe(true);
        });
        tick();
      }));

      it('should update grid header sort on state change', fakeAsync(() => {
        setupTest();
        tick(110); // wait for async heading
        dispatcher.sortSetFieldSelectors([{ fieldSelector: 'column1', descending: false }]);
        fixture.detectChanges();
        tick();

        let headerIconEl = nativeElement.querySelectorAll('th i').item(0) as HTMLElement;
        expect(headerIconEl).toHaveCssClass('fa-caret-up');
      }));

      it('should handle async column headings', fakeAsync(() => {
        setupTest();
        const firstHeading = element.nativeElement.querySelectorAll('.sky-grid-heading')[0];
        expect(firstHeading.textContent.trim()).toEqual('');
        tick(110); // Wait for setTimeout
        fixture.detectChanges();
        expect(firstHeading.textContent.trim()).toEqual('Column1');
      }));

      it('should handle async column descriptions', fakeAsync(() => {
        setupTest();
        const col1 = fixture.componentInstance.grid.gridComponent.columns.find(col => col.id === 'column1');
        expect(col1.description).toEqual('');
        tick(110); // Wait for setTimeout
        fixture.detectChanges();
        expect(col1.description).toEqual('Column1 Description');
      }));

      it('should handle a search being applied', fakeAsync(() => {
        setupTest();

        flush();
        tick();

        state.take(1).subscribe((current) => {
          dispatcher.searchSetText('searchText');
          tick();
          flush();
          component.grid.currentSearchText.subscribe(currentText => {
            expect(currentText).toBe('searchText');
          });
        });

        tick();
      }));

      it('should pass rowHighlightedId through to grid component', fakeAsync(() => {
        setupTest();
        flush();
        tick();

        expect(component.grid.gridComponent.rowHighlightedId).toBe(undefined);

        component.rowHighlightedId = '1';
        fixture.detectChanges();

        expect(component.grid.gridComponent.rowHighlightedId).toBe('1');
        tick();
      }));

      it('should be accessible', async(() => {
        setupTest();

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(fixture.nativeElement).toBeAccessible();
        });
      }));

      it('should be accessible when a search is applied', async(() => {
        setupTest();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          state.take(1).subscribe((current) => {
            dispatcher.searchSetText('searchText');

            fixture.whenStable().then(() => {
              fixture.detectChanges();
              expect(fixture.nativeElement).toBeAccessible();
            });
          });
        });
      }));

      describe('Models and State', () => {
        it('should run ListViewGridColumnsLoadAction action', async(() => {
          setupTest();
          let gridDispatcher = new GridStateDispatcher();
          let gridState = new GridState(new GridStateModel(), gridDispatcher);

          let columns = [
            new SkyGridColumnModel(component.viewtemplates.first),
            new SkyGridColumnModel(component.viewtemplates.first)
          ];
          gridDispatcher.next(new ListViewGridColumnsLoadAction(columns));
          gridState.take(1).subscribe(s => {
            expect(s.columns.count).toBe(2);
          });
        }));

        it('should run ListViewDisplayedGridColumnsLoadAction action with no refresh',
          async(() => {
            setupTest();
            let gridDispatcher = new GridStateDispatcher();
            let gridState = new GridState(new GridStateModel(), gridDispatcher);

            let columns = [
              new SkyGridColumnModel(component.viewtemplates.first),
              new SkyGridColumnModel(component.viewtemplates.first)
            ];
            gridDispatcher.next(new ListViewGridColumnsLoadAction(columns));
            gridState.take(1).subscribe(s => {
              expect(s.columns.count).toBe(2);
            });

            gridDispatcher.next(new ListViewDisplayedGridColumnsLoadAction([
              new SkyGridColumnModel(component.viewtemplates.first)
            ]));

            gridState.take(1).subscribe(s => {
              expect(s.displayedColumns.count).toBe(1);
            });

            gridDispatcher.next(new ListViewDisplayedGridColumnsLoadAction([
              new SkyGridColumnModel(component.viewtemplates.first)
            ]));

            gridState.take(1).subscribe(s => {
              expect(s.displayedColumns.count).toBe(2);
            });
          })
        );
      });
    });

    describe('nonstandard setup', () => {
      it('should respect the hidden property when not hidden columns and displayed columns',
        fakeAsync(() => {
          component.hiddenColumns = undefined;
          setupTest();

          flush();
          tick(110); // wait for async heading
          fixture.detectChanges();

          expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(5);
          expect(element.query(
            By.css('th[sky-cmp-id="column1"]')
          ).nativeElement.textContent.trim()).toBe('Column1');
          expect(element.query(
            By.css('th[sky-cmp-id="column2"]')
          ).nativeElement.textContent.trim()).toBe('Column2');
          expect(element.query(
            By.css('th[sky-cmp-id="column3"]')
          ).nativeElement.textContent.trim()).toBe('Column3');
          expect(element.query(
            By.css('th[sky-cmp-id="hiddenCol1"]')
          ).nativeElement.textContent.trim()).toBe('Column6');
          expect(element.query(
            By.css('th[sky-cmp-id="hiddenCol2"]')
          ).nativeElement.textContent.trim()).toBe('Column7');
        })
      );

      it('should handle setting a searchFunction', fakeAsync(() => {
        let appliedData: any;
        let appliedSearch: string;

        component.searchFn = (data: any, searchText: string) => {
          appliedData = data;
          appliedSearch = searchText;
          return true;
        };

        setupTest();

        flush();
        tick();

        state.take(1).subscribe((current) => {
          current.search.functions[0]('something', 'searchText');
          expect(appliedData).toBe('something');
          expect(appliedSearch).toBe('searchText');
        });

        tick();
      }));
    });
  });

  describe('Display Fixture', () => {
    let state: ListState,
        dispatcher: ListStateDispatcher,
        component: ListViewGridTestComponent,
        fixture: any,
        element: DebugElement;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        imports: [
          ListViewGridFixturesModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher }
        ]
      });

      fixture = TestBed.createComponent(ListViewGridDisplayTestComponent);
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      let items = [
        new ListItemModel('1', { column1: '1', column2: 'Apple',
          column3: 1, column4: moment().add(1, 'minute') }),
        new ListItemModel('2', { column1: '01', column2: 'Banana',
          column3: 1, column4: moment().add(6, 'minute'), column5: 'test' }),
        new ListItemModel('3', { column1: '11', column2: 'Carrot',
          column3: 11, column4: moment().add(4, 'minute') }),
        new ListItemModel('4', { column1: '12', column2: 'Daikon',
          column3: 12, column4: moment().add(2, 'minute') }),
        new ListItemModel('5', { column1: '13', column2: 'Edamame',
          column3: 13, column4: moment().add(5, 'minute') }),
        new ListItemModel('6', { column1: '20', column2: 'Fig',
          column3: 20, column4: moment().add(3, 'minute') }),
        new ListItemModel('7', { column1: '21', column2: 'Grape',
          column3: 21, column4: moment().add(7, 'minute') })
      ];

      dispatcher.next(new ListItemsLoadAction(items, true));
      dispatcher.next(new ListViewsLoadAction([
        new ListViewModel(component.grid.id, component.grid.label)
      ]));
      dispatcher.viewsSetActive(component.grid.id);
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should show 2 columns', () => {
      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(element.query(
        By.css('th[sky-cmp-id="column3"]')).nativeElement.textContent.trim()
      ).toBe('Column3');
      expect(element.query(
        By.css('th[sky-cmp-id="column4"]')
      ).nativeElement.textContent.trim()).toBe('Column4');
    });
  });

  describe('Empty Fixture', () => {
    let state: ListState,
        dispatcher: ListStateDispatcher,
        fixture: any;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        imports: [
          ListViewGridFixturesModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher }
        ]
      });

      fixture = TestBed.createComponent(ListViewGridEmptyTestComponent);
    }));

    it('should throw columns require error', () => {
      expect(() => { fixture.detectChanges(); })
        .toThrowError(/Grid view requires at least one sky-grid-column to render./);
    });
  });

  describe('Grid view with dynamic columns', () => {
     let state: ListState,
        dispatcher: ListStateDispatcher,
        component: ListViewGridDynamicTestComponent,
        fixture: any,
        element: DebugElement;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        imports: [
          ListViewGridFixturesModule
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

      fixture = TestBed.createComponent(ListViewGridDynamicTestComponent);
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should handle grid columns changing to the same ids', () => {
      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(element.query(
        By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
      ).toBe('Name Initial');
      expect(element.query(
        By.css('th[sky-cmp-id="email"]')
      ).nativeElement.textContent.trim()).toBe('Email Initial');

      spyOn(component.grid.selectedColumnIdsChange, 'emit').and.stub();

      component.changeColumns();
      fixture.detectChanges();
      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(element.query(
        By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
      ).toBe('Name');
      expect(element.query(
        By.css('th[sky-cmp-id="email"]')
      ).nativeElement.textContent.trim()).toBe('Email');
      expect(component.grid.selectedColumnIdsChange.emit).not.toHaveBeenCalled();
    });

    it('should handle grid columns changing to contain a different id', (done) => {
      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(element.query(
        By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
      ).toBe('Name Initial');
      expect(element.query(
        By.css('th[sky-cmp-id="email"]')
      ).nativeElement.textContent.trim()).toBe('Email Initial');

      component.grid.selectedColumnIdsChange.subscribe((newColumnIds: string[]) => {
        expect(newColumnIds).toEqual(['name', 'other']);
        done();
      });

      component.changeColumnsNameAndOther();
      fixture.detectChanges();
      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(element.query(
        By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
      ).toBe('Name');
      expect(element.query(
        By.css('th[sky-cmp-id="other"]')).nativeElement.textContent.trim()
      ).toBe('Other');
    });

    it('should handle grid columns changing to contain only a different id', (done) => {
      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(element.query(
        By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
      ).toBe('Name Initial');
      expect(element.query(
        By.css('th[sky-cmp-id="email"]')
      ).nativeElement.textContent.trim()).toBe('Email Initial');

      component.grid.selectedColumnIdsChange.subscribe((newColumnIds: string[]) => {
        expect(newColumnIds).toEqual(['other']);
        done();
      });

      component.changeColumnsOther();
      fixture.detectChanges();
      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(1);
      expect(element.query(
        By.css('th[sky-cmp-id="other"]')).nativeElement.textContent.trim()
      ).toBe('Other');
    });
  });

});

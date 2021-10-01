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
  expectAsync,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyGridColumnModel,
  SkyGridComponent
} from '@skyux/grids';

import {
  ListState,
  ListStateDispatcher,
  ListViewsLoadAction,
  ListViewModel,
  ListItemsLoadAction,
  SkyListComponent
} from '@skyux/list-builder';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  skip,
  take
} from 'rxjs/operators';

import {
  ListViewGridFixturesModule
} from './fixtures/list-view-grid-fixtures.module';

import {
  ListViewGridFixtureComponent
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
} from './state/columns/load.action';

import {
  ListViewDisplayedGridColumnsLoadAction
} from './state/displayed-columns/load.action';

import {
  GridState
} from './state/grid-state.state-node';

import {
  GridStateDispatcher
} from './state/grid-state.rxstate';

import {
  GridStateModel
} from './state/grid-state.model';

describe('List View Grid Component', () => {
  describe('Basic Fixture', () => {
    let state: ListState,
      dispatcher: ListStateDispatcher,
      component: ListViewGridFixtureComponent,
      fixture: ComponentFixture<ListViewGridFixtureComponent>,
      nativeElement: HTMLElement,
      element: DebugElement;

    beforeEach(() => {
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

      fixture = TestBed.createComponent(ListViewGridFixtureComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
    });

    function getSelectInputs(): DebugElement[] {
      return element.queryAll(By.css('.sky-grid-multiselect-cell input'));
    }

    function clickSelectInputByIndex(id: number) {
      const selectInputs = getSelectInputs();
      selectInputs[id].nativeElement.click();
      fixture.detectChanges();
    }

    function setupTest(enableMultiselect: boolean = false) {
      component.enableMultiselect = enableMultiselect;

      fixture.detectChanges();

      let items = [
        new ListItemModel('1', { id: '1', column1: '1', column2: 'Apple',
          column3: 1, column4: new Date().getTime() + 600000 }),
        new ListItemModel('2', { id: '2', column1: '01', column2: 'Banana',
          column3: 1, column4: new Date().getTime() + 3600000, column5: 'test' }),
        new ListItemModel('3', { id: '3', column1: '11', column2: 'Carrot',
          column3: 11, column4: new Date().getTime() + 2400000 }),
        new ListItemModel('4', { id: '4', column1: '12', column2: 'Daikon',
          column3: 12, column4: new Date().getTime() + 1200000 }),
        new ListItemModel('5', { id: '5', column1: '13', column2: 'Edamame',
          column3: 13, column4: new Date().getTime() + 3000000 }),
        new ListItemModel('6', { id: '6', column1: '20', column2: 'Fig',
          column3: 20, column4: new Date().getTime() + 1800000 }),
        new ListItemModel('7', { id: '7', column1: '21', column2: 'Grape',
          column3: 21, column4: new Date().getTime() + 5600000 })
      ];

      dispatcher.next(new ListItemsLoadAction(items, true));
      dispatcher.next(new ListViewsLoadAction([
        new ListViewModel(component.grid.id, component.grid.label)
      ]));
      dispatcher.viewsSetActive(component.grid.id);
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.pipe(skip(1), take(1)).subscribe(() => fixture.detectChanges());
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

      it('should show columns triggered via an ngIf', fakeAsync(() => {
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

        component.showNgIfCol = true;

        spyOn(dispatcher, 'searchSetOptions').and.callThrough();
        fixture.detectChanges();
        tick(100);

        expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(6);
        expect(element.query(
          By.css('th[sky-cmp-id="ngIfCol"]')
        ).nativeElement.textContent.trim()).toBe('Column8');

        expect(dispatcher.searchSetOptions).toHaveBeenCalledTimes(1);
      }));

      it('should listen for the selectedColumnIdsChanged event and update the columns accordingly',
        async(() => {
          setupTest();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            let idsChangeSpy = spyOn(component.grid.selectedColumnIdsChange, 'emit')
              .and.callThrough();
            let dispatcherSpy = spyOn(component.grid.gridDispatcher, 'next').and.callThrough();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
              component.grid.gridComponent.selectedColumnIdsChange.emit(['column1', 'column2', 'column3', 'column4', 'column5']);
              fixture.detectChanges();
              expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(5);
              expect(idsChangeSpy).not.toHaveBeenCalled();
              expect(dispatcherSpy).not
                .toHaveBeenCalledWith(jasmine.any(ListViewDisplayedGridColumnsLoadAction));
            });
          });
        }
        ));

      it('should listen for the selectedColumnIdsChanged event and update the columns accordingly',
        async(() => {
          setupTest();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            component.grid.selectedColumnIdsChange.subscribe((newColumnIds: string[]) => {
              expect(newColumnIds).toEqual(['column1', 'column2']);
            });

            let dispatcherSpy = spyOn(component.grid.gridDispatcher, 'next').and.callThrough();
            component.grid.gridComponent.selectedColumnIdsChange.emit(['column1', 'column2']);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
              expect(element.query(
                By.css('th[sky-cmp-id="column1"]')
              ).nativeElement.textContent.trim()).toBe('Column1');
              expect(element.query(
                By.css('th[sky-cmp-id="column2"]')
              ).nativeElement.textContent.trim()).toBe('Column2');
              expect(dispatcherSpy)
                .toHaveBeenCalledWith(jasmine.any(ListViewDisplayedGridColumnsLoadAction));
            });
          });
        }
      ));

      it('should listen for the sortFieldChange event', fakeAsync(() => {
        setupTest();
        tick(110); // wait for async heading
        let headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
        SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup');
        fixture.detectChanges();

        tick();

        state.pipe(take(1)).subscribe((s) => {
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

        state.pipe(take(1)).subscribe(() => {
          dispatcher.searchSetText('searchText');
          tick();
          flush();
          component.grid.currentSearchText.subscribe(currentText => {
            expect(currentText).toBe('searchText');
          });
        });

        tick();
      }));

      it('should default to vanilla grid search function when the search input is undefined', fakeAsync(() => {
        setupTest();

        flush();
        tick();

        state.pipe(take(1)).subscribe((current) => {
          let searchFound = current.search.functions[0]({column1: 'foobar'}, 'foobar');
          expect(searchFound).toBe(true);
        });

        state.pipe(take(1)).subscribe((current) => {
          let searchFound = current.search.functions[0]({column1: 'foobar'}, 'baz');
          expect(searchFound).toBe(false);
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

      it('should pass settingsKey through to grid component', fakeAsync(() => {
        setupTest();
        flush();
        tick();

        component.settingsKey = 'foobar';
        fixture.detectChanges();

        expect(component.grid.settingsKey).toBe('foobar');
        tick();
      }));

      it('should pass accessibility', async () => {
        setupTest();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should be accessible when a search is applied', async () => {
        setupTest();

        await fixture.whenStable();
        fixture.detectChanges();

        await state.pipe(take(1)).subscribe(async () => {
          dispatcher.searchSetText('searchText');
        });

        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

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
          gridState.pipe(take(1)).subscribe(s => {
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
            gridState.pipe(take(1)).subscribe(s => {
              expect(s.columns.count).toBe(2);
            });

            gridDispatcher.next(new ListViewDisplayedGridColumnsLoadAction([
              new SkyGridColumnModel(component.viewtemplates.first)
            ]));

            gridState.pipe(take(1)).subscribe(s => {
              expect(s.displayedColumns.count).toBe(1);
            });

            gridDispatcher.next(new ListViewDisplayedGridColumnsLoadAction([
              new SkyGridColumnModel(component.viewtemplates.first)
            ]));

            gridState.pipe(take(1)).subscribe(s => {
              expect(s.displayedColumns.count).toBe(2);
            });
          })
        );
      });
    });

    describe('multiselect', () => {
      it('should send action to the dispatcher when multiselect is enabled', fakeAsync(() => {
        const spy = spyOn(dispatcher, 'toolbarShowMultiselectToolbar');

        setupTest(true); // enable multiselect
        flush();
        tick(110); // wait for async heading
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(true);
      }));

      it('should send actions to the dispatcher on multiselectSelectionChange', fakeAsync(() => {
        const spy = spyOn(dispatcher, 'setSelected').and.callThrough();

        setupTest(true); // enable multiselect
        flush();
        tick(110); // wait for async heading
        fixture.detectChanges();

        // Select first row.
        clickSelectInputByIndex(0);
        fixture.detectChanges();

        // Expect dispatcher to send action.
        expect(spy).toHaveBeenCalledWith(['1'], true);

        // Deselect first row.
        spy.calls.reset();
        flush();
        clickSelectInputByIndex(0);
        fixture.detectChanges();

        // Expect dispatcher to send action.
        expect(spy).toHaveBeenCalledWith(['1'], false);
      }));

      it('should check checkboxes when selectedIds are set on init', fakeAsync(() => {
        dispatcher.setSelected(['1', '3'], true, true);
        setupTest(true); // enable multiselect
        flush();
        tick(110); // wait for async heading
        fixture.detectChanges();

        // Expect 1 and 3 to be selected.
        const inputs = getSelectInputs();
        expect(inputs[0].nativeElement.checked).toEqual(true);
        expect(inputs[1].nativeElement.checked).toEqual(false);
        expect(inputs[2].nativeElement.checked).toEqual(true);
        expect(inputs[3].nativeElement.checked).toEqual(false);
        expect(inputs[4].nativeElement.checked).toEqual(false);
        expect(inputs[5].nativeElement.checked).toEqual(false);
        expect(inputs[6].nativeElement.checked).toEqual(false);
      }));

      it('should not send messages to the dispatcher if the grid is emitting programmatic changes', fakeAsync(() => {
        setupTest(true); // enable multiselect
        flush();
        tick(110); // wait for async heading
        fixture.detectChanges();
        const inputs = getSelectInputs();
        const grid = fixture.debugElement.query(By.directive(SkyGridComponent)).context as SkyGridComponent;
        const spy = spyOn(dispatcher, 'setSelected').and.callThrough();

        grid.selectedRowIds = ['1'];
        expect(spy).not.toHaveBeenCalled();

        spy.calls.reset();
        inputs[0].nativeElement.click();
        expect(spy).toHaveBeenCalled();
      }));
    });

    describe('row delete', () => {

      it('should show row delete elements correctly', fakeAsync(() => {
        setupTest();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).toBeNull();
        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).not.toBeNull();
        expect(document.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        fixture.componentInstance.deleteItem('2');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick(500);
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
        expect(document.querySelectorAll('.sky-inline-delete-standard').length).toBe(2);
      }));

      it('should cancel row delete elements correctly via the message stream', fakeAsync(() => {
        setupTest();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).toBeNull();
        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).not.toBeNull();
        expect(document.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        fixture.componentInstance.cancelRowDelete({ id: '1' });
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick(500);
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).toBeNull();
      }));

      it('should cancel row delete elements correctly via click', fakeAsync(() => {
        setupTest();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).toBeNull();
        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).not.toBeNull();
        expect(document.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        (<HTMLElement>document.querySelectorAll('.sky-inline-delete .sky-btn-default')[0]).click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick(500);
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).toBeNull();
      }));

      it('should update the pending status of a row being deleted correctly', fakeAsync(() => {
        setupTest();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).toBeNull();

        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).not.toBeNull();
        expect(document.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        expect(document.querySelectorAll('.sky-inline-delete-standard .sky-wait-mask-loading-blocking').length).toBe(0);

        (<HTMLElement>document.querySelectorAll('.sky-inline-delete-button')[0]).click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).not.toBeNull();
        expect(document.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        expect(document.querySelectorAll('.sky-inline-delete-standard .sky-wait-mask-loading-blocking').length).toBe(1);

        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick(500);
        fixture.detectChanges();
        expect(document.querySelector('#row-delete-ref-1')).not.toBeNull();
        expect(document.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        expect(document.querySelectorAll('.sky-inline-delete-standard .sky-wait-mask-loading-blocking').length).toBe(0);
      }));

      it('should output the delete event correctly', fakeAsync(() => {
        setupTest();
        spyOn(fixture.componentInstance, 'cancelRowDelete').and.callThrough();
        spyOn(fixture.componentInstance, 'finishRowDelete').and.callThrough();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        fixture.componentInstance.deleteItem('1');
        fixture.componentInstance.deleteItem('2');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.componentInstance.finishRowDelete).not.toHaveBeenCalled();
        (<HTMLElement>document.querySelectorAll('.sky-inline-delete-button')[0]).click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick(500);
        fixture.detectChanges();
        expect(fixture.componentInstance.cancelRowDelete).not.toHaveBeenCalled();
        expect(fixture.componentInstance.finishRowDelete).toHaveBeenCalledWith({ id: '1' });
      }));

      it('should output the cancel event correctly', fakeAsync(() => {
        setupTest();
        spyOn(fixture.componentInstance, 'cancelRowDelete').and.callThrough();
        spyOn(fixture.componentInstance, 'finishRowDelete').and.callThrough();
        fixture.detectChanges();
        tick();
        fixture.componentInstance.deleteItem('1');
        fixture.componentInstance.deleteItem('2');
        fixture.detectChanges();
        tick();
        expect(fixture.componentInstance.cancelRowDelete).not.toHaveBeenCalled();
        (<HTMLElement>document.querySelectorAll('.sky-inline-delete .sky-btn-default')[0]).click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick(500);
        fixture.detectChanges();
        expect(fixture.componentInstance.cancelRowDelete).toHaveBeenCalledWith({ id: '1' });
        expect(fixture.componentInstance.finishRowDelete).not.toHaveBeenCalled();
      }));

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

        state.pipe(take(1)).subscribe((current) => {
          current.search.functions[0]('something', 'searchText');
          expect(appliedData).toBe('something');
          expect(appliedSearch).toBe('searchText');
        });

        tick();
      }));
    });
  });

  // xdescribe('Display Fixture', () => {
  //   let state: ListState,
  //     dispatcher: ListStateDispatcher,
  //     component: ListViewGridFixtureComponent,
  //     fixture: any,
  //     element: DebugElement;

  //   beforeEach(async(() => {
  //     dispatcher = new ListStateDispatcher();
  //     state = new ListState(dispatcher);

  //     TestBed.configureTestingModule({
  //       imports: [
  //         ListViewGridFixturesModule
  //       ],
  //       providers: [
  //         { provide: ListState, useValue: state },
  //         { provide: ListStateDispatcher, useValue: dispatcher }
  //       ]
  //     });

  //     fixture = TestBed.createComponent(ListViewGridDisplayTestComponent);
  //     element = fixture.debugElement as DebugElement;
  //     component = fixture.componentInstance;
  //     fixture.detectChanges();

  //     let items = [
  //       new ListItemModel('1', { column1: '1', column2: 'Apple',
  //         column3: 1, column4: new Date().getTime() + 600000 }),
  //       new ListItemModel('2', { column1: '01', column2: 'Banana',
  //         column3: 1, column4: new Date().getTime() + 3600000, column5: 'test' }),
  //       new ListItemModel('3', { column1: '11', column2: 'Carrot',
  //         column3: 11, column4: new Date().getTime() + 2400000 }),
  //       new ListItemModel('4', { column1: '12', column2: 'Daikon',
  //         column3: 12, column4: new Date().getTime() + 1200000 }),
  //       new ListItemModel('5', { column1: '13', column2: 'Edamame',
  //         column3: 13, column4: new Date().getTime() + 3000000 }),
  //       new ListItemModel('6', { column1: '20', column2: 'Fig',
  //         column3: 20, column4: new Date().getTime() + 1800000 }),
  //       new ListItemModel('7', { column1: '21', column2: 'Grape',
  //         column3: 21, column4: new Date().getTime() + 5600000 })
  //     ];

  //     dispatcher.next(new ListItemsLoadAction(items, true));
  //     dispatcher.next(new ListViewsLoadAction([
  //       new ListViewModel(component.grid.id, component.grid.label)
  //     ]));
  //     dispatcher.viewsSetActive(component.grid.id);
  //     fixture.detectChanges();

  //     // always skip the first update to ListState, when state is ready
  //     // run detectChanges once more then begin tests
  //     state.pipe(skip(1), take(1)).subscribe(() => fixture.detectChanges());
  //     fixture.detectChanges();
  //   }));

  //   it('should show 2 columns', () => {
  //     expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="column3"]')).nativeElement.textContent.trim()
  //     ).toBe('Column3');
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="column4"]')
  //     ).nativeElement.textContent.trim()).toBe('Column4');
  //   });
  // });

  // xdescribe('Empty Fixture', () => {
  //   let state: ListState,
  //     dispatcher: ListStateDispatcher,
  //     fixture: any;

  //   beforeEach(async(() => {
  //     dispatcher = new ListStateDispatcher();
  //     state = new ListState(dispatcher);

  //     TestBed.configureTestingModule({
  //       imports: [
  //         ListViewGridFixturesModule
  //       ],
  //       providers: [
  //         { provide: ListState, useValue: state },
  //         { provide: ListStateDispatcher, useValue: dispatcher }
  //       ]
  //     });

  //     fixture = TestBed.createComponent(ListViewGridEmptyTestComponent);
  //   }));

  //   it('should throw columns require error', () => {
  //     expect(() => { fixture.detectChanges(); })
  //       .toThrowError(/Grid view requires at least one sky-grid-column to render./);
  //   });
  // });

  // xdescribe('Grid view with dynamic columns', () => {
  //   let state: ListState,
  //     dispatcher: ListStateDispatcher,
  //     component: ListViewGridDynamicTestComponent,
  //     fixture: any,
  //     element: DebugElement;

  //   beforeEach(async(() => {
  //     dispatcher = new ListStateDispatcher();
  //     state = new ListState(dispatcher);

  //     TestBed.configureTestingModule({
  //       imports: [
  //         ListViewGridFixturesModule
  //       ]
  //     })
  //       .overrideComponent(SkyListComponent, {
  //         set: {
  //           providers: [
  //             { provide: ListState, useValue: state },
  //             { provide: ListStateDispatcher, useValue: dispatcher }
  //           ]
  //         }
  //       });

  //     fixture = TestBed.createComponent(ListViewGridDynamicTestComponent);
  //     element = fixture.debugElement as DebugElement;
  //     component = fixture.componentInstance;
  //     fixture.detectChanges();

  //     // always skip the first update to ListState, when state is ready
  //     // run detectChanges once more then begin tests
  //     state.pipe(skip(1), take(1)).subscribe(() => fixture.detectChanges());
  //     fixture.detectChanges();
  //   }));

  //   it('should handle grid columns changing to the same ids', async(() => {
  //     expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
  //     ).toBe('Name Initial');
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="email"]')
  //     ).nativeElement.textContent.trim()).toBe('Email Initial');

  //     spyOn(component.grid.selectedColumnIdsChange, 'emit').and.stub();

  //     component.changeColumns();
  //     fixture.detectChanges();
  //     expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
  //     ).toBe('Name');
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="email"]')
  //     ).nativeElement.textContent.trim()).toBe('Email');
  //     expect(component.grid.selectedColumnIdsChange.emit).not.toHaveBeenCalled();
  //   }));

  //   it('should handle grid columns changing to contain a different id', async(() => {
  //     expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
  //     ).toBe('Name Initial');
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="email"]')
  //     ).nativeElement.textContent.trim()).toBe('Email Initial');

  //     component.grid.selectedColumnIdsChange.subscribe((newColumnIds: string[]) => {
  //       expect(newColumnIds).toEqual(['name', 'other']);
  //     });

  //     component.changeColumnsNameAndOther();
  //     fixture.detectChanges();
  //     expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
  //     ).toBe('Name');
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="other"]')).nativeElement.textContent.trim()
  //     ).toBe('Other');
  //   }));

  //   it('should handle grid columns changing to contain only a different id', async(() => {
  //     expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="name"]')).nativeElement.textContent.trim()
  //     ).toBe('Name Initial');
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="email"]')
  //     ).nativeElement.textContent.trim()).toBe('Email Initial');

  //     component.grid.selectedColumnIdsChange.subscribe((newColumnIds: string[]) => {
  //       expect(newColumnIds).toEqual(['other']);
  //     });

  //     component.changeColumnsOther();
  //     fixture.detectChanges();
  //     expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(1);
  //     expect(element.query(
  //       By.css('th[sky-cmp-id="other"]')).nativeElement.textContent.trim()
  //     ).toBe('Other');
  //   }));
  // });

});

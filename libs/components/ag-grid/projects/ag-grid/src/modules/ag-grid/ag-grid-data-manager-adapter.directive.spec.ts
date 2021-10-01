import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  AgGridAngular
} from 'ag-grid-angular';

import {
  Column,
  ColumnMovedEvent,
  RowNode,
  RowSelectedEvent
} from 'ag-grid-community';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyDataManagerService,
  SkyDataManagerState
} from '@skyux/data-manager';

import {
  SkyAgGridDataManagerAdapterDirective
} from './ag-grid-data-manager-adapter.directive';

import {
  SkyAgGridDataManagerFixtureComponent
} from './fixtures/ag-grid-data-manager.component.fixture';

import {
  SkyAgGridFixtureModule
} from './fixtures/ag-grid.module.fixture';

describe('SkyAgGridDataManagerAdapterDirective', () => {
  let agGridDataManagerFixture: ComponentFixture<SkyAgGridDataManagerFixtureComponent>;
  let agGridDataManagerFixtureComponent: SkyAgGridDataManagerFixtureComponent;
  let agGridComponent: AgGridAngular;
  let dataManagerService: SkyDataManagerService;
  let dataState: SkyDataManagerState;
  let dataViewEl: DebugElement;
  let agGridDataManagerDirective: SkyAgGridDataManagerAdapterDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
      providers: [SkyDataManagerService]
    });

    agGridDataManagerFixture = TestBed.createComponent(SkyAgGridDataManagerFixtureComponent);
    agGridDataManagerFixtureComponent = agGridDataManagerFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);

    agGridDataManagerFixture.detectChanges();

    agGridComponent = agGridDataManagerFixtureComponent.agGrid;
    dataViewEl = agGridDataManagerFixture.debugElement.query(By.directive(SkyAgGridDataManagerAdapterDirective));
    agGridDataManagerDirective = dataViewEl.injector.get(SkyAgGridDataManagerAdapterDirective);

    dataManagerService.getDataStateUpdates('test').subscribe(state => dataState = state);
  });

  it('should update the data state when a row is selected', async () => {
    await agGridDataManagerFixture.whenStable();

    const rowNode = new RowNode();
    rowNode.data = { id: '1' };
    spyOn(rowNode, 'isSelected').and.returnValue(true);
    spyOn(dataManagerService, 'updateDataState');

    const rowSelected = {
      node: rowNode
    } as RowSelectedEvent;

    dataState.selectedIds = [ '3', '1' ];

    agGridDataManagerFixture.detectChanges();

    agGridComponent.rowSelected.emit(rowSelected);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, agGridDataManagerFixtureComponent.viewConfig.id);
  });

  it('should update the data state when a row is deselected', async () => {
    await agGridDataManagerFixture.whenStable();

    const rowNode = new RowNode();
    rowNode.data = { id: '3' };
    spyOn(rowNode, 'isSelected').and.returnValue(false);
    spyOn(dataManagerService, 'updateDataState');

    const rowSelected = {
      node: rowNode
    } as RowSelectedEvent;

    dataState.selectedIds = [ ];

    agGridDataManagerFixture.detectChanges();

    agGridComponent.rowSelected.emit(rowSelected);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, agGridDataManagerFixtureComponent.viewConfig.id);
  });

  it('should set columns visible based on the data state changes', async () => {
    spyOn(agGridComponent.columnApi, 'setColumnVisible');

    dataManagerService.updateDataState(agGridDataManagerFixtureComponent.initialDataState, 'unitTest');

    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();

    expect(agGridComponent.columnApi.setColumnVisible).toHaveBeenCalled();
  });

  it('should update the data state when a column is moved', async () => {
    await agGridDataManagerFixture.whenStable();

    const colId = 'testCol';
    const colDef = { colId };
    const column = new Column(colDef, undefined, colId, true);

    spyOn(agGridComponent.columnApi, 'getAllDisplayedVirtualColumns').and.returnValue([column]);
    spyOn(dataManagerService, 'updateDataState');

    const columnMoved = {
      source: 'uiColumnMoved'
    } as ColumnMovedEvent;

    const viewState = dataState.views[0];
    viewState.displayedColumnIds = [ colId ];

    agGridComponent.columnMoved.emit(columnMoved);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, agGridDataManagerFixtureComponent.viewConfig.id);
  });

  it('should update the data state when the sort changes', async () => {
    await agGridDataManagerFixture.whenStable();

    const sortModel = [{ colId: 'name', sort: 'desc' }];

    spyOn(agGridComponent.api, 'getSortModel').and.returnValue(sortModel);
    spyOn(dataManagerService, 'updateDataState');

    dataState.activeSortOption = {
      id: 'name',
      descending: true,
      propertyName: 'name',
      label: 'Name'
    };

    agGridComponent.sortChanged.emit();

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, agGridDataManagerFixtureComponent.viewConfig.id);
  });

  describe('selecting rows', () => {

    it('should use the ag grid API to select all rows when onSelectAllClick is called', async () => {
      spyOn(agGridComponent.api, 'selectAll');

      agGridDataManagerFixture.detectChanges();
      await agGridDataManagerFixture.whenStable();

      const viewConfig = dataManagerService.getViewById(agGridDataManagerFixtureComponent.viewConfig.id);
      viewConfig.onSelectAllClick();

      expect(agGridComponent.api.selectAll).toHaveBeenCalled();
    });

    it('should use the ag grid API to deselect all rows when onClearAllClick is called', async () => {
      spyOn(agGridComponent.api, 'deselectAll');

      agGridDataManagerFixture.detectChanges();
      await agGridDataManagerFixture.whenStable();

      const viewConfig = dataManagerService.getViewById(agGridDataManagerFixtureComponent.viewConfig.id);
      viewConfig.onClearAllClick();

      expect(agGridComponent.api.deselectAll).toHaveBeenCalled();
    });
  });

  it('should throw an error if there are 2 grids in a component', () => {
    spyOn(console, 'warn');
    agGridDataManagerFixtureComponent.displaySecondGrid = true;
    agGridDataManagerFixture.detectChanges();

    expect(console.warn).toHaveBeenCalledWith('More than one ag-grid child component was found. Using the first ag-Grid.');
  });

  it('should unregister the grid if no grids are rendered', () => {
    expect(agGridDataManagerDirective.agGridList.length).toBe(1);

    agGridDataManagerFixtureComponent.displayFirstGrid = false;
    agGridDataManagerFixture.detectChanges();

    expect(agGridDataManagerDirective.agGridList.length).toBe(0);
  });

  it('should register a grid if no other grids are rendered', () => {
    expect(agGridDataManagerDirective.agGridList.length).toBe(1);
    expect(agGridDataManagerDirective.skyAgGridWrapperList.length).toBe(1);

    agGridDataManagerFixtureComponent.displayFirstGrid = false;
    agGridDataManagerFixture.detectChanges();

    expect(agGridDataManagerDirective.agGridList.length).toBe(0);
    expect(agGridDataManagerDirective.skyAgGridWrapperList.length).toBe(0);

    agGridDataManagerFixtureComponent.displaySecondGrid = true;
    agGridDataManagerFixture.detectChanges();

    expect(agGridDataManagerDirective.agGridList.length).toBe(1);
    expect(agGridDataManagerDirective.skyAgGridWrapperList.length).toBe(1);
  });
});

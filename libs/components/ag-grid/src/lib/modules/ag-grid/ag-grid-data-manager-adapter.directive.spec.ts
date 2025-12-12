import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { AgGridAngular } from 'ag-grid-angular';
import {
  BeanCollection,
  Column,
  ColumnMovedEvent,
  ColumnResizedEvent,
  ColumnState,
  DragStartedEvent,
  DragStoppedEvent,
  GridApi,
  RowNode,
  RowSelectedEvent,
} from 'ag-grid-community';

import { SkyAgGridDataManagerAdapterDirective } from './ag-grid-data-manager-adapter.directive';
import { SkyAgGridDataManagerFixtureComponent } from './fixtures/ag-grid-data-manager.component.fixture';
import { SkyAgGridFixtureModule } from './fixtures/ag-grid.module.fixture';

describe('SkyAgGridDataManagerAdapterDirective', () => {
  let agGridDataManagerFixture: ComponentFixture<SkyAgGridDataManagerFixtureComponent>;
  let agGridDataManagerFixtureComponent: SkyAgGridDataManagerFixtureComponent;
  let agGridComponent: AgGridAngular;
  let dataManagerService: SkyDataManagerService;
  let dataState: SkyDataManagerState;
  let dataViewEl: DebugElement;
  let agGridDataManagerDirective: SkyAgGridDataManagerAdapterDirective;
  let mediaQueryController: SkyMediaQueryTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
      providers: [SkyDataManagerService, provideSkyMediaQueryTesting()],
    });

    agGridDataManagerFixture = TestBed.createComponent(
      SkyAgGridDataManagerFixtureComponent,
    );

    agGridDataManagerFixtureComponent =
      agGridDataManagerFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);

    agGridDataManagerFixture.detectChanges();

    agGridComponent = agGridDataManagerFixtureComponent.agGrid as AgGridAngular;
    dataViewEl = agGridDataManagerFixture.debugElement.query(
      By.directive(SkyAgGridDataManagerAdapterDirective),
    );
    agGridDataManagerDirective = dataViewEl.injector.get(
      SkyAgGridDataManagerAdapterDirective,
    );

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    dataManagerService
      .getDataStateUpdates('test')
      .subscribe((state) => (dataState = state));

    mediaQueryController.setBreakpoint('sm');
  });

  it('should update the data state when a row is selected', async () => {
    await agGridDataManagerFixture.whenStable();
    agGridComponent.api.deselectAll();
    dataState.selectedIds = [];
    dataManagerService.updateDataState(dataState, 'unitTest');

    agGridDataManagerFixture.detectChanges();

    const rowNode = new RowNode({} as BeanCollection);
    rowNode.data = { id: '1' };
    spyOn(rowNode, 'isSelected').and.returnValue(true);
    spyOn(dataManagerService, 'updateDataState');

    const rowSelected = {
      node: rowNode,
      source: 'api',
      context: {},
      type: 'rowSelected',
      rowIndex: 0,
      api: {} as GridApi,
      data: {} as any,

      rowPinned: null,
    } as RowSelectedEvent;

    const newDataState = new SkyDataManagerState({ ...dataState });
    newDataState.selectedIds = ['1'];

    agGridDataManagerFixture.detectChanges();

    agGridComponent.rowSelected.emit(rowSelected);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      newDataState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should update the data state when a row is deselected', async () => {
    await agGridDataManagerFixture.whenStable();

    agGridComponent.api.selectAll();
    dataState.selectedIds = ['0', '1', '2', '3'];
    dataManagerService.updateDataState(dataState, 'unitTest');
    agGridDataManagerFixture.detectChanges();

    const rowNode = new RowNode({} as BeanCollection);
    rowNode.data = { id: '3' };
    spyOn(rowNode, 'isSelected').and.returnValue(false);
    spyOn(dataManagerService, 'updateDataState');

    const rowSelected = {
      node: rowNode,
      source: 'api',
      context: {},
      type: 'rowSelected',
      rowIndex: 0,
      api: {} as GridApi,
      data: {} as any,

      rowPinned: null,
    } as RowSelectedEvent;

    const newDataState = new SkyDataManagerState({ ...dataState });
    newDataState.selectedIds = ['0', '1', '2'];

    agGridDataManagerFixture.detectChanges();

    agGridComponent.rowSelected.emit(rowSelected);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      newDataState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should set columns visible based on the data state changes', async () => {
    const newDataState = new SkyDataManagerState({
      views: [
        {
          viewId:
            agGridDataManagerFixtureComponent.initialDataState.views[0].viewId,
          displayedColumnIds: ['selected', 'name'],
        },
      ],
    });
    dataManagerService.updateDataState(newDataState, 'unitTest');

    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();

    expect(agGridComponent.api.getColumn('name')?.isVisible()).toBeTruthy();
  });

  it('should update the data state column widths when columns are removed', async () => {
    const updateDataState = spyOn(
      dataManagerService,
      'updateDataState',
    ).and.callThrough();

    const columnRemovedState = new SkyDataManagerState({
      views: [
        {
          viewId:
            agGridDataManagerFixtureComponent.initialDataState.views[0].viewId,
          displayedColumnIds: ['selected', 'name'],
          columnWidths: {
            xs: { name: 180, target: 220 },
            sm: { name: 300, target: 400 },
          },
        },
      ],
    });

    dataManagerService.updateDataState(columnRemovedState, 'unitTest');

    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();

    const updatedState = new SkyDataManagerState({
      views: [
        {
          viewId:
            agGridDataManagerFixtureComponent.initialDataState.views[0].viewId,
          displayedColumnIds: ['selected', 'name'],
          columnWidths: {
            xs: { name: 180 },
            sm: { name: 300 },
          },
        },
      ],
    });

    expect(updateDataState).toHaveBeenCalledWith(
      updatedState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should apply data state column widths when the breakpoint changes', async () => {
    await agGridDataManagerFixture.whenStable();

    mediaQueryController.setBreakpoint('sm');
    agGridDataManagerFixture.detectChanges();

    expect(agGridComponent.api.getColumn('name')?.getActualWidth()).toEqual(
      300,
    );
    expect(agGridComponent.api.getColumn('target')?.getActualWidth()).toEqual(
      400,
    );

    mediaQueryController.setBreakpoint('xs');
    agGridDataManagerFixture.detectChanges();

    expect(agGridComponent.api.getColumn('name')?.getActualWidth()).toEqual(
      180,
    );
    expect(agGridComponent.api.getColumn('target')?.getActualWidth()).toEqual(
      220,
    );
  });

  it('should update the data state when a column is moved', async () => {
    await agGridDataManagerFixture.whenStable();

    // Arrange
    // Set a column order that is different from the default order
    const updateDataState = spyOn(dataManagerService, 'updateDataState');
    agGridComponent.api.applyColumnState({
      state: [
        {
          colId: 'selected',
          hide: false,
        },
        {
          colId: 'target',
          hide: false,
        },
        {
          colId: 'name',
          hide: false,
        },
        {
          colId: 'noHeader',
          hide: false,
        },
      ],
      applyOrder: true,
    });
    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const columnMoved = {
      source: 'uiColumnMoved',
      api: agGridComponent.api,
    } as ColumnMovedEvent;

    // Act
    agGridComponent.columnMoved.emit(columnMoved);
    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert
    expect(updateDataState).toHaveBeenCalledWith(
      jasmine.objectContaining({
        views: [
          jasmine.objectContaining({
            displayedColumnIds: ['selected', 'target', 'name', 'noHeader'],
          }),
        ],
      }),
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should update the data state when a column is dragged', async () => {
    await agGridDataManagerFixture.whenStable();

    const colIds = ['col1', 'col2'];
    const api = {
      getColumnState: (): ColumnState[] => {
        return colIds.map((colId): ColumnState => {
          return {
            colId,
            hide: false,
          };
        });
      },
    };

    spyOn(dataManagerService, 'updateDataState');

    const columnDragged = {
      api,
    } as DragStartedEvent & DragStoppedEvent;

    agGridComponent.dragStarted.emit(columnDragged);
    colIds.reverse();
    agGridComponent.dragStopped.emit(columnDragged);

    expect(dataManagerService.updateDataState).toHaveBeenCalled();
  });

  it('should not update the data state when a column is dragged and released in the same spot', async () => {
    await agGridDataManagerFixture.whenStable();

    const colIds = ['col1', 'col2'];
    const api = {
      getColumnState: (): ColumnState[] => {
        return colIds.map((colId): ColumnState => {
          return {
            colId,
            hide: false,
          };
        });
      },
    };
    const columnDragged = {
      api,
    } as DragStartedEvent & DragStoppedEvent;
    agGridComponent.dragStopped.emit(columnDragged);
    spyOn(dataManagerService, 'updateDataState');
    agGridComponent.dragStopped.emit(columnDragged);
    expect(dataManagerService.updateDataState).not.toHaveBeenCalled();
  });

  it('should update the data state for the sm breakpoint when a column is resized', async () => {
    await agGridDataManagerFixture.whenStable();
    const updateDataState = spyOn(dataManagerService, 'updateDataState');

    const column = {
      getColId: (): string => {
        return 'name';
      },
      getActualWidth: (): number => {
        return 100;
      },
    };

    const columnResized = {
      source: 'uiColumnResized',
      api: agGridComponent.api,
      column: column as Column,
    } as ColumnResizedEvent;

    const viewState = dataState.views[0];
    viewState.columnWidths = {
      xs: { name: 180, target: 220 },
      sm: { name: 100, target: 400 },
    };
    agGridComponent.columnResized.emit(columnResized);
    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();

    expect(updateDataState).toHaveBeenCalledWith(
      dataState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should update the data state for the xs breakpoint when a column is resized', async () => {
    mediaQueryController.setBreakpoint('xs');

    await agGridDataManagerFixture.whenStable();
    const updateDataState = spyOn(dataManagerService, 'updateDataState');

    const column = {
      getColId: (): string => {
        return 'name';
      },
      getActualWidth: (): number => {
        return 100;
      },
    };

    const columnResized = {
      source: 'uiColumnResized',
      api: agGridComponent.api,
      column: column as Column,
    } as ColumnResizedEvent;

    const viewState = dataState.views[0];
    viewState.columnWidths = {
      xs: { name: 100, target: 220 },
      sm: { name: 300, target: 400 },
    };
    agGridComponent.columnResized.emit(columnResized);
    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();

    expect(updateDataState).toHaveBeenCalledWith(
      dataState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should update the data state when the sort changes', async () => {
    await agGridDataManagerFixture.whenStable();

    agGridComponent.api.applyColumnState({
      state: [
        {
          colId: 'selected',
        },
        {
          colId: 'name',
          sort: 'desc',
          sortIndex: 0,
        },
        {
          colId: 'target',
        },
        {
          colId: 'noHeader',
        },
      ],
      applyOrder: false,
    });
    spyOn(dataManagerService, 'updateDataState');

    dataState.activeSortOption = {
      id: 'name',
      descending: true,
      propertyName: 'name',
      label: 'First Name',
    };

    agGridComponent.sortChanged.emit();

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should update the data state when the sort changes to null', async () => {
    await agGridDataManagerFixture.whenStable();

    agGridComponent.api.applyColumnState({
      state: [
        {
          colId: 'selected',
        },
        {
          colId: 'name',
        },
        {
          colId: 'target',
        },
        {
          colId: 'noHeader',
        },
      ],
      applyOrder: false,
    });
    spyOn(dataManagerService, 'updateDataState');

    dataState.activeSortOption = undefined;

    agGridComponent.sortChanged.emit();

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should update the data state when the sort changes and use empty strings for header/field when not present', async () => {
    await agGridDataManagerFixture.whenStable();

    agGridComponent.api.applyColumnState({
      state: [
        {
          colId: 'selected',
        },
        {
          colId: 'name',
        },
        {
          colId: 'target',
        },
        {
          colId: 'noHeader',
          sort: 'desc',
        },
      ],
      applyOrder: false,
    });
    spyOn(dataManagerService, 'updateDataState');

    dataState.activeSortOption = {
      id: 'noHeader',
      descending: true,
      propertyName: '',
      label: '',
    };

    agGridComponent.sortChanged.emit();

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  it('should update the data state when the sort changes and use empty strings for header/field when not present', async () => {
    await agGridDataManagerFixture.whenStable();

    agGridComponent.api.applyColumnState({
      state: [
        {
          colId: 'selected',
        },
        {
          colId: 'name',
        },
        {
          colId: 'target',
        },
        {
          colId: 'noHeader',
          sort: 'desc',
          sortIndex: 0,
        },
      ],
      applyOrder: false,
    });
    spyOn(dataManagerService, 'updateDataState');

    dataState.activeSortOption = {
      id: 'noHeader',
      descending: true,
      propertyName: '',
      label: '',
    };

    agGridComponent.sortChanged.emit();

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      agGridDataManagerFixtureComponent.viewConfig.id,
    );
  });

  describe('selecting rows', () => {
    it('should use the ag grid API to select all rows when onSelectAllClick is called', async () => {
      agGridDataManagerFixture.detectChanges();
      await agGridDataManagerFixture.whenStable();

      const viewConfig = dataManagerService.getViewById(
        agGridDataManagerFixtureComponent.viewConfig.id,
      );
      const selectAll = spyOn(agGridComponent.api, 'selectAll');
      viewConfig?.onSelectAllClick?.();

      expect(selectAll).toHaveBeenCalled();
      expect(agGridComponent.api.getSelectedRows()).not.toEqual([]);
    });

    it('should use the ag grid API to deselect all rows when onClearAllClick is called', async () => {
      agGridDataManagerFixture.detectChanges();
      await agGridDataManagerFixture.whenStable();

      const viewConfig = dataManagerService.getViewById(
        agGridDataManagerFixtureComponent.viewConfig.id,
      );
      viewConfig?.onClearAllClick?.();
      agGridDataManagerFixture.detectChanges();
      await agGridDataManagerFixture.whenStable();

      expect(agGridComponent.api.getSelectedRows()).toEqual([]);
    });
  });

  it('should throw an error if there are 2 grids in a component', () => {
    spyOn(console, 'warn');
    agGridDataManagerFixtureComponent.displaySecondGrid = true;
    agGridDataManagerFixture.detectChanges();

    expect(console.warn).toHaveBeenCalledWith(
      'More than one ag-grid child component was found. Using the first ag-Grid.',
    );
  });

  it('should unregister the grid if no grids are rendered', () => {
    expect(agGridDataManagerDirective.agGridList().length).toBe(1);

    agGridDataManagerFixtureComponent.displayFirstGrid = false;
    agGridDataManagerFixture.detectChanges();

    expect(agGridDataManagerDirective.agGridList().length).toBe(0);
  });

  it('should register a grid if no other grids are rendered', () => {
    expect(agGridDataManagerDirective.agGridList().length).toBe(1);
    expect(agGridDataManagerDirective.skyAgGridWrapperList().length).toBe(1);

    agGridDataManagerFixtureComponent.displayFirstGrid = false;
    agGridDataManagerFixture.detectChanges();

    expect(agGridDataManagerDirective.agGridList().length).toBe(0);
    expect(agGridDataManagerDirective.skyAgGridWrapperList().length).toBe(0);

    agGridDataManagerFixtureComponent.displaySecondGrid = true;
    agGridDataManagerFixture.detectChanges();

    expect(agGridDataManagerDirective.agGridList().length).toBe(1);
    expect(agGridDataManagerDirective.skyAgGridWrapperList().length).toBe(1);
  });

  it('should apply descending sort to rows when data manager active sort changes', async () => {
    const colId = 'name';

    const newDataState = new SkyDataManagerState({ ...dataState });
    newDataState.activeSortOption = {
      id: colId,
      propertyName: colId,
      descending: true,
      label: 'Name',
    };
    dataManagerService.updateDataState(newDataState, 'unitTest');
    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();

    expect(agGridComponent.api.getColumnState()).toEqual([
      jasmine.objectContaining({
        colId: 'selected',
        sort: null,
      }),
      jasmine.objectContaining({
        colId: 'name',
        sort: 'desc',
      }),
      jasmine.objectContaining({
        colId: 'target',
        sort: null,
      }),
      jasmine.objectContaining({
        colId: 'noHeader',
        sort: null,
      }),
    ]);
  });

  it('should apply ascending sort to rows when data manager active sort changes', async () => {
    const colId = 'name';

    const newDataState = new SkyDataManagerState({ ...dataState });
    newDataState.activeSortOption = {
      id: colId,
      propertyName: colId,
      descending: false,
      label: 'Name',
    };
    dataManagerService.updateDataState(newDataState, 'unitTest');
    agGridDataManagerFixture.detectChanges();
    await agGridDataManagerFixture.whenStable();

    expect(agGridComponent.api.getColumnState()).toEqual([
      jasmine.objectContaining({
        colId: 'selected',
        sort: null,
      }),
      jasmine.objectContaining({
        colId: 'name',
        sort: 'asc',
      }),
      jasmine.objectContaining({
        colId: 'target',
        sort: null,
      }),
      jasmine.objectContaining({
        colId: 'noHeader',
        sort: null,
      }),
    ]);
  });
});

it('should move the horizontal scroll based on enableTopScroll check', async () => {
  TestBed.configureTestingModule({
    imports: [SkyAgGridFixtureModule],
    providers: [SkyDataManagerService],
  });

  const fixture = TestBed.createComponent(SkyAgGridDataManagerFixtureComponent);
  fixture.componentInstance.gridOptions.context = {
    enableTopScroll: true,
  };
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  await fixture.whenStable();
  const gridComponents: string[] = Array.from(
    fixture.nativeElement.querySelector('.ag-root')?.children || [],
  ).map((el) => (el as HTMLElement).classList[0]);
  // Expect the scrollbar below the header.
  expect(gridComponents).toEqual([
    'ag-header',
    'ag-body-horizontal-scroll',
    'ag-floating-top',
    'ag-body',
    'ag-sticky-top',
    'ag-sticky-bottom',
    'ag-floating-bottom',
    'ag-overlay',
  ]);

  const agGrid = fixture.componentInstance.agGrid;
  expect(agGrid).toBeDefined();
  expect(agGrid!.api.getGridOption('context')?.enableTopScroll).toBeTrue();

  const dataManagerService = TestBed.inject(SkyDataManagerService);
  fixture.detectChanges();
  await fixture.whenStable();
  const viewkeeperClasses =
    dataManagerService.viewkeeperClasses.value[
      fixture.componentInstance.viewConfig.id
    ];
  expect(viewkeeperClasses).toEqual([
    '.ag-header',
    '.ag-body-horizontal-scroll',
  ]);
});

it('should refresh the grid when a view is reactivated', async () => {
  TestBed.configureTestingModule({
    imports: [SkyAgGridFixtureModule],
    providers: [SkyDataManagerService],
  });

  const fixture = TestBed.createComponent(SkyAgGridDataManagerFixtureComponent);
  fixture.componentInstance.displayOtherView = true;
  fixture.detectChanges();
  await fixture.whenStable();

  const agGrid = fixture.componentInstance.agGrid;
  expect(agGrid).toBeDefined();
  spyOn(agGrid!.api, 'refreshCells');

  const dataManagerService = TestBed.inject(SkyDataManagerService);
  const viewConfig = dataManagerService.getViewById(
    fixture.componentInstance.viewConfig.id,
  );
  expect(viewConfig).toBeDefined();
  dataManagerService.updateActiveViewId(viewConfig!.id);

  fixture.detectChanges();
  await fixture.whenStable();

  expect(agGrid!.api.refreshCells).toHaveBeenCalled();
});

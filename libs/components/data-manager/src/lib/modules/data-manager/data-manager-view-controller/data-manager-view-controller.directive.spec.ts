import { Component, inject, input, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyBreakpoint, SkyLogService } from '@skyux/core';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import {
  SkyDataColumnOption,
  SkyDataColumnSource,
  SkyDataSelectionSource,
  SkyDataSort,
  SkyDataSortSource,
} from '@skyux/lists';

import { SkyDataManagerModule } from '../data-manager.module';
import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataManagerSortOption } from '../models/data-manager-sort-option';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataManagerStateOptions } from '../models/data-manager-state-options';
import { SkyDataViewStateOptions } from '../models/data-view-state-options';

/**
 * A minimal grid that implements the data source contracts, so these tests
 * exercise the directive rather than a data grid.
 */
@Component({
  selector: 'app-test-grid',
  template: '',
  providers: [
    { provide: SkyDataColumnSource, useExisting: TestGridComponent },
    { provide: SkyDataSelectionSource, useExisting: TestGridComponent },
    { provide: SkyDataSortSource, useExisting: TestGridComponent },
  ],
})
class TestGridComponent
  implements SkyDataColumnSource, SkyDataSelectionSource, SkyDataSortSource
{
  public readonly columnOptions =
    input.required<readonly SkyDataColumnOption[]>();

  public readonly multiselect = input(true);
  public readonly selectedRowIds = model<readonly string[]>([]);
  public readonly sort = model<SkyDataSort | undefined>();

  public readonly columnWidths = signal<Readonly<Record<string, number>>>({});
  public readonly displayedColumnIds = signal<readonly string[]>([]);
  public readonly selectionPruningDisabled = signal(false);
  public readonly viewkeeperClasses = signal<readonly string[]>(['.header']);
  public readonly viewkeeperDisabled = signal(false);

  public disableSelectionPruning(): void {
    this.selectionPruningDisabled.set(true);
  }

  public disableViewkeeper(): void {
    this.viewkeeperDisabled.set(true);
  }

  public setColumnWidths(columnWidths: Readonly<Record<string, number>>): void {
    this.columnWidths.set(columnWidths);
  }

  public setDisplayedColumnIds(columnIds: readonly string[]): void {
    this.displayedColumnIds.set(columnIds);
  }

  public setSelectedRowIds(selectedRowIds: readonly string[]): void {
    this.selectedRowIds.set(selectedRowIds);
  }

  public setSort(sort: SkyDataSort | undefined): void {
    this.sort.set(sort);
  }
}

@Component({
  template: `<sky-data-manager>
    <sky-data-manager-toolbar />
    <sky-data-view [viewId]="viewId()">
      @for (key of gridKeys(); track key) {
        <app-test-grid
          skyDataManagerViewController
          [columnOptions]="columnOptions()"
          [multiselect]="multiselect()"
          [(selectedRowIds)]="selectedRowIds"
          [(sort)]="sort"
        />
      }
      @if (showOtherGrid()) {
        <app-test-grid
          skyDataManagerViewController
          [columnOptions]="[{ id: 'other', labelText: 'Other' }]"
        />
      }
    </sky-data-view>
  </sky-data-manager>`,
  imports: [SkyDataManagerModule, TestGridComponent],
  providers: [SkyDataManagerService],
})
class TestHostComponent {
  // Changing the key recreates the grid.
  public readonly gridKeys = model(['a']);
  public readonly multiselect = model(true);
  public readonly selectedRowIds = model<readonly string[]>([]);
  public readonly showOtherGrid = model(false);
  public readonly sort = model<SkyDataSort | undefined>();
  public readonly viewId = model<string | undefined>('view-1');
  public readonly columnOptions = model<readonly SkyDataColumnOption[]>([
    { id: 'locked', labelText: 'Locked', alwaysDisplayed: true },
    { id: 'name', labelText: 'Name', description: 'The full name.' },
    { id: 'age', labelText: 'Age' },
    { id: 'notes', labelText: 'Notes', initialHide: true },
  ]);
  public readonly state = toSignal(
    inject(SkyDataManagerService).getDataStateUpdates('test-host'),
  );
}

describe('SkyDataManagerViewControllerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let dataManagerSvc: SkyDataManagerService;

  const nameAscending: SkyDataManagerSortOption = {
    descending: false,
    id: 'name-ascending',
    label: 'Name (A-Z)',
    propertyName: 'name',
  };

  async function detect(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getGrid(): TestGridComponent {
    return fixture.debugElement.query(
      (node) => node.componentInstance instanceof TestGridComponent,
    ).componentInstance as TestGridComponent;
  }

  function getStoredState(): SkyDataManagerStateOptions | undefined {
    return fixture.componentInstance.state()?.getStateOptions();
  }

  function getStoredViewState(): SkyDataViewStateOptions | undefined {
    return fixture.componentInstance
      .state()
      ?.getViewStateById('view-1')
      ?.getViewStateOptions();
  }

  function initDataManager(options?: {
    columnOptions?: SkyDataManagerColumnPickerOption[];
    stateOptions?: SkyDataManagerStateOptions;
    viewState?: SkyDataViewStateOptions;
  }): void {
    dataManagerSvc.initDataManager({
      activeViewId: 'view-1',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        ...options?.stateOptions,
        views: options?.viewState ? [options.viewState] : [],
      }),
    });
    dataManagerSvc.initDataView({
      id: 'view-1',
      name: 'View',
      columnPickerEnabled: true,
      columnOptions: options?.columnOptions,
    });
  }

  /**
   * Publishes a change to the stored state the way another part of the data
   * manager would, such as a toolbar or another view.
   */
  function updateStateFromOtherSource(
    change: (stateOptions: SkyDataManagerStateOptions) => void,
  ): void {
    const stateOptions = getStoredState() ?? {};
    change(stateOptions);
    dataManagerSvc.updateDataState(
      new SkyDataManagerState(stateOptions),
      'other',
    );
  }

  /**
   * Counts the data states the directive publishes.
   */
  function spyOnPublishedStates(): () => number {
    const updateDataStateSpy = spyOn(
      dataManagerSvc,
      'updateDataState',
    ).and.callThrough();

    return () =>
      updateDataStateSpy.calls
        .allArgs()
        .filter(([, sourceId]) => sourceId === 'skyDataManagerViewController')
        .length;
  }

  function setBreakpoint(breakpoint: SkyBreakpoint): void {
    TestBed.inject(SkyMediaQueryTestingController).setBreakpoint(breakpoint);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideSkyMediaQueryTesting()],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    dataManagerSvc = fixture.debugElement.injector.get(SkyDataManagerService);
  });

  it('should offer the columns in the column picker', async () => {
    initDataManager();
    await detect();

    expect(dataManagerSvc.getViewById('view-1')?.columnOptions).toEqual([
      {
        alwaysDisplayed: true,
        description: undefined,
        id: 'locked',
        initialHide: undefined,
        label: 'Locked',
      },
      {
        alwaysDisplayed: undefined,
        description: 'The full name.',
        id: 'name',
        initialHide: undefined,
        label: 'Name',
      },
      {
        alwaysDisplayed: undefined,
        description: undefined,
        id: 'age',
        initialHide: undefined,
        label: 'Age',
      },
      {
        alwaysDisplayed: undefined,
        description: undefined,
        id: 'notes',
        initialHide: true,
        label: 'Notes',
      },
    ]);
  });

  it('should keep column options the view config supplies', async () => {
    initDataManager({ columnOptions: [{ id: 'name', label: 'Custom' }] });
    await detect();

    expect(dataManagerSvc.getViewById('view-1')?.columnOptions).toEqual([
      { id: 'name', label: 'Custom' },
    ]);
  });

  it('should store the declared column layout on the view state', async () => {
    initDataManager();
    await detect();

    expect(getGrid().displayedColumnIds()).toEqual(['locked', 'name', 'age']);
    expect(getStoredViewState()).toEqual(
      jasmine.objectContaining({
        columnIds: ['locked', 'name', 'age', 'notes'],
        displayedColumnIds: ['locked', 'name', 'age'],
      }),
    );
  });

  it('should add a view state when the data state has none', async () => {
    // A view initialized before the data manager gets no view state.
    dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
    dataManagerSvc.initDataManager({
      activeViewId: 'view-1',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({}),
    });
    await detect();

    expect(getStoredViewState()?.displayedColumnIds).toEqual([
      'locked',
      'name',
      'age',
    ]);
  });

  it('should keep the column headers visible beneath the toolbar', async () => {
    initDataManager();
    await detect();

    expect(getGrid().viewkeeperDisabled()).toBeTrue();
    expect(dataManagerSvc.viewkeeperClasses.value['view-1']).toEqual([
      '.header',
    ]);
  });

  it('should apply a stored column layout', async () => {
    initDataManager({
      viewState: {
        viewId: 'view-1',
        columnIds: ['locked', 'name', 'age', 'notes'],
        displayedColumnIds: ['locked', 'notes'],
      },
    });
    await detect();

    expect(getGrid().displayedColumnIds()).toEqual(['locked', 'notes']);
  });

  it('should apply a column picker change', async () => {
    initDataManager();
    await detect();

    dataManagerSvc.updateDataState(
      new SkyDataManagerState({
        views: [
          {
            viewId: 'view-1',
            columnIds: ['locked', 'name', 'age', 'notes'],
            displayedColumnIds: ['locked', 'notes', 'name'],
          },
        ],
      }),
      'columnPicker',
    );
    await detect();

    expect(getGrid().displayedColumnIds()).toEqual(['locked', 'notes', 'name']);
  });

  it('should store a column order the user changes in the grid', async () => {
    initDataManager();
    await detect();

    // A user reordering columns in the grid, such as by dragging a column
    // header, changes what it displays without going through the directive.
    getGrid().displayedColumnIds.set(['locked', 'age', 'name']);
    await detect();

    expect(getStoredViewState()?.displayedColumnIds).toEqual([
      'locked',
      'age',
      'name',
    ]);
  });

  it('should offer and display a column added after initialization', async () => {
    initDataManager();
    await detect();

    fixture.componentInstance.columnOptions.update((columnOptions) => [
      ...columnOptions,
      { id: 'email', labelText: 'Email' },
    ]);
    await detect();

    expect(
      dataManagerSvc
        .getViewById('view-1')
        ?.columnOptions?.map((option) => option.label),
    ).toEqual(['Locked', 'Name', 'Age', 'Notes', 'Email']);
    expect(getGrid().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
      'email',
    ]);
  });

  it('should offer the columns when the view is initialized after the columns render', async () => {
    dataManagerSvc.initDataManager({
      activeViewId: 'view-1',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({}),
    });
    await detect();

    dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
    await detect();

    expect(
      dataManagerSvc
        .getViewById('view-1')
        ?.columnOptions?.map((option) => option.id),
    ).toEqual(['locked', 'name', 'age', 'notes']);
  });

  it('should offer the columns of a grid that is recreated', async () => {
    initDataManager();
    await detect();

    fixture.componentInstance.gridKeys.set([]);
    await detect();

    expect(dataManagerSvc.getViewById('view-1')?.columnOptions).toBeUndefined();

    fixture.componentInstance.columnOptions.update((columnOptions) => [
      ...columnOptions,
      { id: 'email', labelText: 'Email' },
    ]);
    fixture.componentInstance.gridKeys.set(['b']);
    await detect();

    expect(
      dataManagerSvc
        .getViewById('view-1')
        ?.columnOptions?.map((option) => option.id),
    ).toEqual(['locked', 'name', 'age', 'notes', 'email']);
  });

  it('should let a grid created before the one it replaces is destroyed take over', async () => {
    const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');
    initDataManager();
    await detect();

    // `@for` creates the new grid before destroying the old one.
    fixture.componentInstance.columnOptions.update((columnOptions) => [
      ...columnOptions,
      { id: 'email', labelText: 'Email' },
    ]);
    fixture.componentInstance.gridKeys.set(['b']);
    await detect();

    expect(warnSpy).not.toHaveBeenCalled();
    expect(getGrid().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
      'email',
    ]);
    expect(
      dataManagerSvc
        .getViewById('view-1')
        ?.columnOptions?.map((option) => option.id),
    ).toEqual(['locked', 'name', 'age', 'notes', 'email']);
  });

  it('should let only the first view controller in a data view take effect', async () => {
    const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');
    fixture.componentInstance.showOtherGrid.set(true);
    initDataManager();
    await detect();

    expect(warnSpy).toHaveBeenCalledOnceWith(
      'A data view can have only one `skyDataManagerViewController`. Only the first one controls the view.',
    );
    expect(
      dataManagerSvc
        .getViewById('view-1')
        ?.columnOptions?.map((option) => option.id),
    ).toEqual(['locked', 'name', 'age', 'notes']);
    expect(getStoredViewState()?.displayedColumnIds).toEqual([
      'locked',
      'name',
      'age',
    ]);

    const otherGrid = fixture.debugElement.queryAll(
      (node) => node.componentInstance instanceof TestGridComponent,
    )[1].componentInstance as TestGridComponent;
    expect(otherGrid.viewkeeperDisabled()).toBeFalse();
    expect(otherGrid.selectionPruningDisabled()).toBeFalse();
  });

  it('should display a column added since the column layout was stored', async () => {
    initDataManager({
      viewState: {
        viewId: 'view-1',
        columnIds: ['locked', 'name', 'notes'],
        displayedColumnIds: ['locked', 'name'],
      },
    });
    await detect();

    expect(getGrid().displayedColumnIds()).toEqual(['locked', 'name', 'age']);
  });

  it('should do nothing when the data view has no view ID', async () => {
    fixture.componentInstance.viewId.set(undefined);
    fixture.componentInstance.sort.set({ direction: 'asc', field: 'name' });
    setBreakpoint('md');
    initDataManager();
    const updateDataStateSpy = spyOn(
      dataManagerSvc,
      'updateDataState',
    ).and.callThrough();
    await detect();

    expect(dataManagerSvc.getViewById('view-1')?.columnOptions).toBeUndefined();
    expect(fixture.componentInstance.sort()).toEqual({
      direction: 'asc',
      field: 'name',
    });
    expect(updateDataStateSpy).not.toHaveBeenCalled();
  });

  describe('sort', () => {
    it('should store the sort the user applies', async () => {
      initDataManager();
      await detect();
      const getPublishedCount = spyOnPublishedStates();

      getGrid().sort.set({ direction: 'desc', field: 'name' });
      await detect();

      expect(getStoredState()?.activeSortOption).toEqual({
        descending: true,
        id: 'name',
        label: 'Name',
        propertyName: 'name',
      });
      expect(getPublishedCount()).toBe(1);
    });

    it('should apply a stored sort in place of the sort the grid starts with', async () => {
      fixture.componentInstance.sort.set({ direction: 'asc', field: 'age' });
      initDataManager({
        stateOptions: {
          activeSortOption: {
            descending: true,
            id: 'name-descending',
            label: 'Name (Z-A)',
            propertyName: 'name',
          },
        },
      });
      await detect();

      expect(fixture.componentInstance.sort()).toEqual({
        direction: 'desc',
        field: 'name',
      });
      expect(getStoredState()?.activeSortOption).toEqual({
        descending: true,
        id: 'name-descending',
        label: 'Name (Z-A)',
        propertyName: 'name',
      });
    });

    it('should clear the sort the grid starts with when no sort is stored', async () => {
      fixture.componentInstance.sort.set({ direction: 'asc', field: 'age' });
      initDataManager();
      await detect();

      expect(fixture.componentInstance.sort()).toBeUndefined();
      expect(getStoredState()?.activeSortOption).toBeUndefined();
    });

    it('should clear the stored sort when the user clears the sort', async () => {
      initDataManager({ stateOptions: { activeSortOption: nameAscending } });
      await detect();

      expect(getGrid().sort()).toEqual({ direction: 'asc', field: 'name' });

      getGrid().sort.set(undefined);
      await detect();

      expect(getStoredState()?.activeSortOption).toBeUndefined();
      expect(getGrid().sort()).toBeUndefined();
    });

    it('should apply the stored sort once the data manager initializes after the grid renders', async () => {
      fixture.componentInstance.sort.set({ direction: 'asc', field: 'age' });
      await detect();

      expect(fixture.componentInstance.sort()).toEqual({
        direction: 'asc',
        field: 'age',
      });

      initDataManager({ stateOptions: { activeSortOption: nameAscending } });
      await detect();

      expect(getGrid().sort()).toEqual({ direction: 'asc', field: 'name' });
      expect(getStoredState()?.activeSortOption).toEqual(nameAscending);
    });

    it('should label a sort by a column the grid does not declare with its field', async () => {
      initDataManager();
      await detect();

      getGrid().sort.set({ direction: 'asc', field: 'unknown' });
      await detect();

      expect(getStoredState()?.activeSortOption).toEqual({
        descending: false,
        id: 'unknown',
        label: 'unknown',
        propertyName: 'unknown',
      });
    });

    it('should clear the sort when another source clears the stored sort', async () => {
      initDataManager({ stateOptions: { activeSortOption: nameAscending } });
      await detect();

      updateStateFromOtherSource((stateOptions) => {
        stateOptions.activeSortOption = undefined;
      });
      await detect();

      expect(getGrid().sort()).toBeUndefined();
    });

    it('should keep a stored sort by a property the grid has no column for', async () => {
      const citySort: SkyDataManagerSortOption = {
        descending: false,
        id: 'city',
        label: 'City',
        propertyName: 'city',
      };
      fixture.componentInstance.sort.set({ direction: 'asc', field: 'name' });
      initDataManager({ stateOptions: { activeSortOption: citySort } });
      await detect();

      expect(getGrid().sort()).toBeUndefined();
      expect(getStoredState()?.activeSortOption).toEqual(citySort);
    });
  });

  describe('selection', () => {
    it('should store the rows the user selects', async () => {
      initDataManager();
      await detect();
      const getPublishedCount = spyOnPublishedStates();

      getGrid().selectedRowIds.set(['1', '2']);
      await detect();

      expect(getStoredState()?.selectedIds).toEqual(['1', '2']);
      expect(getPublishedCount()).toBe(1);
    });

    it('should apply the stored selected rows', async () => {
      initDataManager({ stateOptions: { selectedIds: ['2'] } });
      await detect();

      expect(fixture.componentInstance.selectedRowIds()).toEqual(['2']);
    });

    it('should clear the selection when another source clears the stored selection', async () => {
      initDataManager({ stateOptions: { selectedIds: ['2'] } });
      await detect();

      updateStateFromOtherSource((stateOptions) => {
        stateOptions.selectedIds = undefined;
      });
      await detect();

      expect(getGrid().selectedRowIds()).toEqual([]);
    });

    it('should store the rows the grid starts with selected when none are stored', async () => {
      fixture.componentInstance.selectedRowIds.set(['1']);
      initDataManager();
      await detect();

      expect(getStoredState()?.selectedIds).toEqual(['1']);
    });

    it('should store nothing when the grid starts with no rows selected', async () => {
      initDataManager();
      await detect();

      expect(getStoredState()?.selectedIds).toBeUndefined();
    });

    it('should keep rows selected while a search or filter hides them', async () => {
      initDataManager();
      await detect();

      expect(getGrid().selectionPruningDisabled()).toBeTrue();
    });

    it('should sync the selection only while the grid allows multiple rows to be selected', async () => {
      fixture.componentInstance.multiselect.set(false);
      initDataManager({ stateOptions: { selectedIds: ['2'] } });
      await detect();

      expect(getGrid().selectedRowIds()).toEqual([]);

      getGrid().selectedRowIds.set(['1']);
      await detect();

      expect(getStoredState()?.selectedIds).toEqual(['2']);

      fixture.componentInstance.multiselect.set(true);
      await detect();

      expect(getGrid().selectedRowIds()).toEqual(['2']);
    });
  });

  describe('column widths', () => {
    it('should store the column widths the user sets for the current breakpoint', async () => {
      setBreakpoint('md');
      initDataManager();
      await detect();

      getGrid().columnWidths.set({ name: 200 });
      await detect();

      expect(getStoredViewState()?.columnWidths).toEqual({
        xs: {},
        sm: { name: 200 },
      });

      setBreakpoint('xs');
      await detect();
      getGrid().columnWidths.set({ name: 100 });
      await detect();

      expect(getStoredViewState()?.columnWidths).toEqual({
        xs: { name: 100 },
        sm: { name: 200 },
      });
    });

    it('should store a changed width for a column that already has one', async () => {
      setBreakpoint('md');
      initDataManager({
        viewState: {
          viewId: 'view-1',
          columnWidths: { xs: {}, sm: { name: 200 } },
        },
      });
      await detect();

      getGrid().columnWidths.set({ name: 250 });
      await detect();

      expect(getStoredViewState()?.columnWidths?.sm).toEqual({ name: 250 });
    });

    it('should apply the column widths stored for the current breakpoint', async () => {
      setBreakpoint('md');
      initDataManager({
        viewState: {
          viewId: 'view-1',
          columnWidths: { xs: { name: 100 }, sm: { name: 200 } },
        },
      });
      await detect();
      const getPublishedCount = spyOnPublishedStates();

      expect(getGrid().columnWidths()).toEqual({ name: 200 });

      setBreakpoint('xs');
      await detect();

      expect(getGrid().columnWidths()).toEqual({ name: 100 });

      setBreakpoint('lg');
      await detect();

      expect(getGrid().columnWidths()).toEqual({ name: 200 });
      expect(getPublishedCount()).toBe(0);
    });

    it('should apply the stored column widths once the breakpoint is known', async () => {
      initDataManager({
        viewState: {
          viewId: 'view-1',
          columnWidths: { xs: {}, sm: { name: 200 } },
        },
      });
      await detect();

      expect(getGrid().columnWidths()).toEqual({});

      setBreakpoint('sm');
      await detect();

      expect(getGrid().columnWidths()).toEqual({ name: 200 });
    });

    it('should store column widths for a view with no stored state', async () => {
      // With no columns, no column layout adds a view state.
      fixture.componentInstance.columnOptions.set([]);
      setBreakpoint('md');
      dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
      dataManagerSvc.initDataManager({
        activeViewId: 'view-1',
        dataManagerConfig: {},
        defaultDataState: new SkyDataManagerState({}),
      });
      await detect();

      expect(getStoredViewState()).toBeUndefined();

      getGrid().columnWidths.set({ name: 200 });
      await detect();

      expect(getStoredViewState()?.columnWidths).toEqual({
        xs: {},
        sm: { name: 200 },
      });
    });
  });
});

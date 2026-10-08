import { Component, inject, input, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDataColumnOption, SkyDataColumnSource } from '@skyux/lists';

import { SkyDataManagerModule } from '../data-manager.module';
import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewStateOptions } from '../models/data-view-state-options';

/**
 * A minimal `SkyDataColumnSource` so these tests exercise the directive rather
 * than a data grid.
 */
@Component({
  selector: 'app-test-columns',
  template: '',
  providers: [
    { provide: SkyDataColumnSource, useExisting: TestColumnsComponent },
  ],
})
class TestColumnsComponent implements SkyDataColumnSource {
  public readonly columnOptions =
    input.required<readonly SkyDataColumnOption[]>();

  public readonly displayedColumnIds = signal<readonly string[]>([]);

  public setDisplayedColumnIds(columnIds: readonly string[]): void {
    this.displayedColumnIds.set(columnIds);
  }
}

@Component({
  template: `<sky-data-manager>
    <sky-data-manager-toolbar />
    <sky-data-view [viewId]="viewId()">
      <app-test-columns
        skyDataManagerColumnController
        [columnOptions]="columnOptions()"
      />
    </sky-data-view>
  </sky-data-manager>`,
  imports: [SkyDataManagerModule, TestColumnsComponent],
  providers: [SkyDataManagerService],
})
class TestHostComponent {
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

describe('SkyDataManagerColumnControllerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let dataManagerSvc: SkyDataManagerService;

  async function detect(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getColumnSource(): TestColumnsComponent {
    return fixture.debugElement.query(
      (node) => node.componentInstance instanceof TestColumnsComponent,
    ).componentInstance as TestColumnsComponent;
  }

  function getStoredViewState(): SkyDataViewStateOptions | undefined {
    return fixture.componentInstance
      .state()
      ?.getViewStateById('view-1')
      ?.getViewStateOptions();
  }

  function initDataManager(options?: {
    columnOptions?: SkyDataManagerColumnPickerOption[];
    viewState?: SkyDataViewStateOptions;
  }): void {
    dataManagerSvc.initDataManager({
      activeViewId: 'view-1',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
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

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
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

    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
    ]);
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

  it('should apply a stored column layout', async () => {
    initDataManager({
      viewState: {
        viewId: 'view-1',
        columnIds: ['locked', 'name', 'age', 'notes'],
        displayedColumnIds: ['locked', 'notes'],
      },
    });
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual(['locked', 'notes']);
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

    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'notes',
      'name',
    ]);
  });

  it('should store a column order the user changes in the column source', async () => {
    initDataManager();
    await detect();

    // A user reordering columns in the source, such as by dragging a column
    // header, changes what it displays without going through the directive.
    getColumnSource().displayedColumnIds.set(['locked', 'age', 'name']);
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
    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
      'email',
    ]);
  });

  it('should do nothing when the data view has no view ID', async () => {
    fixture.componentInstance.viewId.set(undefined);
    initDataManager();
    const updateDataStateSpy = spyOn(
      dataManagerSvc,
      'updateDataState',
    ).and.callThrough();
    await detect();

    expect(dataManagerSvc.getViewById('view-1')?.columnOptions).toBeUndefined();
    expect(updateDataStateSpy).not.toHaveBeenCalled();
  });
});

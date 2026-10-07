import { Component, inject, input, model, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyUIConfigService } from '@skyux/core';
import { SkyDataColumnOption, SkyDataColumnSource } from '@skyux/lists';

import { toSignal } from '@angular/core/rxjs-interop';
import { SkyDataManagerModule } from '../data-manager.module';
import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';

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
  public readonly dataColumns = input<readonly SkyDataColumnOption[]>([
    { id: 'locked', labelText: 'Locked', alwaysDisplayed: true },
    { id: 'name', labelText: 'Name' },
    { id: 'age', labelText: 'Age' },
    { id: 'notes', labelText: 'Notes', initialHide: true },
  ]);

  public readonly displayedColumnIds = signal<readonly string[]>([]);

  // Like the data grid, compare against what displays before setting it, so
  // the directive's effects are exercised against a source that reads its own
  // displayed columns.
  public setDisplayedColumnIds(columnIds: string[]): void {
    if (this.displayedColumnIds().join() !== columnIds.join()) {
      this.displayedColumnIds.set(columnIds);
    }
  }

  /**
   * Changes the displayed columns the way a user does in the component itself,
   * such as by dragging a column header, rather than through the directive.
   */
  public reorderColumns(columnIds: string[]): void {
    this.displayedColumnIds.set(columnIds);
  }
}

@Component({
  template: ` <sky-data-manager>
    <sky-data-manager-toolbar />
    @if (useViewId()) {
      <sky-data-view [viewId]="'view-1'">
        <app-test-columns
          skyDataManagerColumnController
          [dataColumns]="dataColumns()"
        />
      </sky-data-view>
    } @else {
      <sky-data-view [viewId]="">
        <app-test-columns
          skyDataManagerColumnController
          [dataColumns]="dataColumns()"
        />
      </sky-data-view>
    }
  </sky-data-manager>`,
  imports: [SkyDataManagerModule, TestColumnsComponent],
  providers: [SkyDataManagerService, SkyUIConfigService],
})
class TestHostComponent {
  public readonly useViewId = model(false);
  public readonly dataColumns = model<readonly SkyDataColumnOption[]>([
    { id: 'locked', labelText: 'Locked', alwaysDisplayed: true },
    { id: 'name', labelText: 'Name' },
    { id: 'age', labelText: 'Age' },
    { id: 'notes', labelText: 'Notes', initialHide: true },
  ]);
  public readonly state = toSignal(
    inject(SkyDataManagerService).getDataStateUpdates('test-host'),
    { initialValue: new SkyDataManagerState({}) },
  );
}

describe('SkyDataManagerColumnControllerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let dataManagerSvc: SkyDataManagerService;

  async function detect(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getColumnSource(): TestColumnsComponent {
    return fixture.debugElement.query(
      (node) => node.componentInstance instanceof TestColumnsComponent,
    ).componentInstance as TestColumnsComponent;
  }

  function initDataManager(state?: SkyDataManagerState): void {
    dataManagerSvc.initDataManager({
      activeViewId: 'view-1',
      dataManagerConfig: {},
      defaultDataState: state ?? new SkyDataManagerState({}),
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    dataManagerSvc = fixture.debugElement.injector.get(SkyDataManagerService);
  });

  describe('without a view ID', () => {
    it('should do nothing', async () => {
      fixture.componentInstance.dataColumns.set([]);
      initDataManager();
      const updateDataStateSpy = spyOn(
        dataManagerSvc,
        'updateDataState',
      ).and.callThrough();
      await detect();

      expect(updateDataStateSpy).not.toHaveBeenCalled();
    });
  });

  describe('with a view ID', () => {
    beforeEach(() => {
      fixture.componentInstance.useViewId.set(true);
    });

    it('should add the columns to the view config', async () => {
      dataManagerSvc.initDataView({
        id: 'view-1',
        name: 'View',
        columnPickerEnabled: true,
      });
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
          description: undefined,
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

    it('should keep column options the view supplied', async () => {
      dataManagerSvc.initDataView({
        id: 'view-1',
        name: 'View',
        columnPickerEnabled: true,
        columnOptions: [{ id: 'name', label: 'Custom' }],
      });
      initDataManager();
      await detect();

      expect(dataManagerSvc.getViewById('view-1')?.columnOptions).toEqual([
        { id: 'name', label: 'Custom' },
      ]);
    });

    it('should store the column layout on the view state', async () => {
      dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
      initDataManager();
      await detect();

      const viewState = fixture.componentInstance
        .state()
        .getViewStateById('view-1');

      expect(viewState?.displayedColumnIds).toEqual(['locked', 'name', 'age']);
      expect(viewState?.columnIds).toEqual(['locked', 'name', 'age', 'notes']);
    });

    it('should store a column order the component changes on the view state', async () => {
      dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
      initDataManager();
      await detect();

      getColumnSource().setDisplayedColumnIds(['locked', 'age', 'name']);
      await detect();

      expect(
        fixture.componentInstance.state().getViewStateById('view-1')
          ?.displayedColumnIds,
      ).toEqual(['locked', 'age', 'name']);
    });

    it('should keep a column order the user changes in the component on the view state', async () => {
      dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
      initDataManager();
      await detect();

      getColumnSource().reorderColumns(['locked', 'age', 'name']);
      await detect();

      expect(getColumnSource().displayedColumnIds()).toEqual([
        'locked',
        'age',
        'name',
      ]);
      expect(
        fixture.componentInstance.state().getViewStateById('view-1')
          ?.displayedColumnIds,
      ).toEqual(['locked', 'age', 'name']);
    });

    it('should apply a stored view column layout', async () => {
      dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
      initDataManager(
        new SkyDataManagerState({
          views: [
            {
              viewId: 'view-1',
              columnIds: ['locked', 'name', 'age', 'notes'],
              displayedColumnIds: ['locked', 'notes'],
            },
          ],
        }),
      );
      await detect();

      expect(getColumnSource().displayedColumnIds()).toEqual([
        'locked',
        'notes',
      ]);
    });
  });
});

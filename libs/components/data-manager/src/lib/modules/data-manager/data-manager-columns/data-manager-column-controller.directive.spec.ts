import { Component, input, model, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyUIConfigService } from '@skyux/core';
import { SkyDataColumnOption, SkyDataColumnSource } from '@skyux/lists';

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

  public setDisplayedColumnIds(columnIds: string[]): void {
    this.displayedColumnIds.set(columnIds);
  }
}

@Component({
  template: `<sky-data-manager>
    <sky-data-manager-toolbar />
    @if (useView()) {
      <sky-data-view [viewId]="'view-1'">
        <app-test-columns
          skyDataManagerColumnController
          [dataColumns]="dataColumns()"
        />
      </sky-data-view>
    } @else {
      <app-test-columns
        skyDataManagerColumnController
        [dataColumns]="dataColumns()"
      />
    }
  </sky-data-manager>`,
  imports: [SkyDataManagerModule, TestColumnsComponent],
  providers: [SkyDataManagerService, SkyUIConfigService],
})
class TestHostComponent {
  public readonly useView = model(false);
  public readonly dataColumns = model<readonly SkyDataColumnOption[]>([
    { id: 'locked', labelText: 'Locked', alwaysDisplayed: true },
    { id: 'name', labelText: 'Name' },
    { id: 'age', labelText: 'Age' },
    { id: 'notes', labelText: 'Notes', initialHide: true },
  ]);
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

  describe('without a sky-data-view', () => {
    it('should register the columns on the service', async () => {
      initDataManager();
      await detect();

      expect(dataManagerSvc.columnOptions()?.map((col) => col.id)).toEqual([
        'locked',
        'name',
        'age',
        'notes',
      ]);
    });

    it('should apply the declared visibility when nothing is stored', async () => {
      initDataManager();
      await detect();

      expect(getColumnSource().displayedColumnIds()).toEqual([
        'locked',
        'name',
        'age',
      ]);
      expect(dataManagerSvc.state().displayedColumnIds).toEqual([
        'locked',
        'name',
        'age',
      ]);
      expect(dataManagerSvc.state().columnIds).toEqual([
        'locked',
        'name',
        'age',
        'notes',
      ]);
    });

    it('should apply a stored column layout instead of the declared default', async () => {
      initDataManager(
        new SkyDataManagerState({
          columnIds: ['locked', 'name', 'age', 'notes'],
          displayedColumnIds: ['locked', 'age'],
        }),
      );
      await detect();

      expect(getColumnSource().displayedColumnIds()).toEqual(['locked', 'age']);
    });

    it('should store a column order the component changes, such as a user reordering columns', async () => {
      initDataManager();
      await detect();

      getColumnSource().setDisplayedColumnIds(['locked', 'age', 'name']);
      await detect();

      expect(dataManagerSvc.state().displayedColumnIds).toEqual([
        'locked',
        'age',
        'name',
      ]);
    });

    it('should display a column added after the layout was stored', async () => {
      initDataManager(
        new SkyDataManagerState({
          columnIds: ['locked', 'name'],
          displayedColumnIds: ['locked', 'name'],
        }),
      );
      await detect();

      expect(getColumnSource().displayedColumnIds()).toEqual([
        'locked',
        'name',
        'age',
      ]);
    });

    it('should clear the registered columns when destroyed', async () => {
      initDataManager();
      await detect();

      expect(dataManagerSvc.columnOptions()).toBeDefined();

      fixture.destroy();

      expect(dataManagerSvc.columnOptions()).toBeUndefined();
    });

    it('should do nothing when the component declares no columns', async () => {
      fixture.componentInstance.dataColumns.set([]);
      initDataManager();
      await detect();

      expect(getColumnSource().displayedColumnIds()).toEqual([]);
      expect(dataManagerSvc.state().displayedColumnIds).toBeUndefined();
    });

    it('should handle stored column IDs without stored displayed column IDs', async () => {
      initDataManager(
        new SkyDataManagerState({
          columnIds: ['locked', 'name', 'age', 'notes'],
        }),
      );
      await detect();

      // Every column was already known, so none is treated as new, and only
      // the column that cannot be hidden displays.
      expect(getColumnSource().displayedColumnIds()).toEqual(['locked']);
      expect(dataManagerSvc.state().displayedColumnIds).toEqual(['locked']);
    });
  });

  describe('with a sky-data-view', () => {
    beforeEach(() => {
      fixture.componentInstance.useView.set(true);
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

      const viewState = dataManagerSvc.state().getViewStateById('view-1');

      expect(viewState?.displayedColumnIds).toEqual(['locked', 'name', 'age']);
      expect(viewState?.columnIds).toEqual(['locked', 'name', 'age', 'notes']);
      expect(dataManagerSvc.state().displayedColumnIds).toBeUndefined();
    });

    it('should store a column order the component changes on the view state', async () => {
      dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
      initDataManager();
      await detect();

      getColumnSource().setDisplayedColumnIds(['locked', 'age', 'name']);
      await detect();

      expect(
        dataManagerSvc.state().getViewStateById('view-1')?.displayedColumnIds,
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

    it('should not register the columns on the service', async () => {
      dataManagerSvc.initDataView({ id: 'view-1', name: 'View' });
      initDataManager();
      await detect();

      expect(dataManagerSvc.columnOptions()).toBeUndefined();
    });
  });
});

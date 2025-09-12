import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyDataManagerDockType } from '@skyux/data-manager';
import { SkyToolbarModule } from '@skyux/layout';

import { FilterModalComponent } from './filter-modal.component';
import { Filters } from './filters';

@Component({
  standalone: true,
  selector: 'test-data-manager-harness',
  templateUrl: './data-manager-harness-test.component.html',
  providers: [SkyDataManagerService, SkyUIConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataManagerModule, SkyToolbarModule],
})
export class DataManagerHarnessTestComponent implements OnInit {
  public selectedColumns: string[] = [];
  protected viewId1 = 'view-1';
  protected viewId2 = 'view-2';

  public dock: SkyDataManagerDockType | undefined = 'fill';

  readonly #dataManagerSvc = inject(SkyDataManagerService);

  public ngOnInit(): void {
    this.#dataManagerSvc.initDataManager({
      activeViewId: this.viewId1,
      dataManagerConfig: {
        filterModalComponent: FilterModalComponent,
        sortOptions: [
          {
            id: 'az',
            label: 'Name (A - Z)',
            descending: false,
            propertyName: 'name',
          },
          {
            id: 'za',
            label: 'Name (Z - A)',
            descending: true,
            propertyName: 'name',
          },
        ],
      },
      defaultDataState: new SkyDataManagerState({
        filterData: {
          filtersApplied: true,
          filters: {
            hideOrange: true,
          } satisfies Filters,
        },
        views: [
          {
            viewId: this.viewId1,
            displayedColumnIds: ['selected', 'name', 'description'],
          },
        ],
      }),
    });

    this.#dataManagerSvc
      .getDataStateUpdates(this.viewId1)
      .subscribe((state) => {
        this.selectedColumns =
          state.getViewStateById(this.viewId1)?.displayedColumnIds ?? [];
      });

    this.#dataManagerSvc.initDataView({
      id: this.viewId1,
      name: 'View 1',
      iconName: 'table',
      searchEnabled: true,
      multiselectToolbarEnabled: true,
      columnPickerEnabled: true,
      sortEnabled: true,
      filterButtonEnabled: true,
      columnOptions: [
        {
          id: 'selected',
          alwaysDisplayed: true,
          label: 'selected',
        },
        {
          id: 'name',
          label: 'Fruit name',
          description: 'The name of the fruit.',
        },
        {
          id: 'description',
          label: 'Description',
          description: 'Some information about the fruit.',
        },
      ],
    });

    this.#dataManagerSvc.initDataView({
      id: this.viewId2,
      name: 'View 2',
      iconName: 'list',
    });
  }
}

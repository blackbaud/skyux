import { Component, Input, OnInit, inject } from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.scss'],
  providers: [SkyDataManagerService],
  standalone: false,
})
export class DataManagerComponent implements OnInit {
  @Input()
  public activeView = 'view-1';

  #dataManagerService = inject(SkyDataManagerService);

  public ngOnInit(): void {
    this.#dataManagerService.initDataManager({
      activeViewId: this.activeView,
      dataManagerConfig: {
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
          },
        },
        views: [
          {
            viewId: 'view-1',
          },
          {
            viewId: 'view-2',
            displayedColumnIds: ['selected', 'name', 'description'],
          },
        ],
      }),
    });

    this.#dataManagerService.initDataView({
      id: 'view-1',
      name: 'View 1',
      iconName: 'list',
      searchEnabled: true,
      sortEnabled: true,
      multiselectToolbarEnabled: true,
      columnPickerEnabled: true,
      filterButtonEnabled: true,
      showFilterButtonText: false,
    });

    this.#dataManagerService.initDataView({
      id: 'view-2',
      name: 'View 2',
      iconName: 'table',
      searchEnabled: true,
      sortEnabled: true,
      multiselectToolbarEnabled: true,
      columnPickerEnabled: true,
      filterButtonEnabled: true,
      showFilterButtonText: false,
    });
  }
}

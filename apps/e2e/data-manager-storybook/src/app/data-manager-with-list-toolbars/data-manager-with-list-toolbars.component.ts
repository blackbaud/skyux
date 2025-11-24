import { Component, OnInit, inject } from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

@Component({
  standalone: false,
  selector: 'app-data-manager-with-list-toolbars',
  templateUrl: './data-manager-with-list-toolbars.component.html',
  styleUrls: ['./data-manager-with-list-toolbars.component.scss'],
  providers: [SkyDataManagerService],
})
export class DataManagerWithListToolbarsComponent implements OnInit {
  #dataManagerService = inject(SkyDataManagerService);

  public ngOnInit(): void {
    this.#dataManagerService.initDataManager({
      activeViewId: 'view-1',
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
          filters: {},
        },
        views: [
          {
            viewId: 'view-1',
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
    });
  }
}

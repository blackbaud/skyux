import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { DataManagerFiltersModalDemoComponent } from './data-filter-modal.component';
import {
  SKY_DATA_MANAGER_DEMO_DATA,
  SkyDataManagerDemoRow,
} from './data-manager-demo-data';

@Component({
  selector: 'app-data-manager-demo',
  templateUrl: './data-manager-demo.component.html',
  providers: [SkyDataManagerService, SkyUIConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataManagerDemoComponent implements OnInit {
  public items: SkyDataManagerDemoRow[] = SKY_DATA_MANAGER_DEMO_DATA;

  #dataManagerService = inject(SkyDataManagerService);

  public ngOnInit(): void {
    this.#dataManagerService.initDataManager({
      activeViewId: 'repeaterView',
      dataManagerConfig: {
        filterModalComponent: DataManagerFiltersModalDemoComponent,
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
            viewId: 'gridView',
            displayedColumnIds: ['selected', 'name', 'description'],
          },
        ],
      }),
    });
  }
}

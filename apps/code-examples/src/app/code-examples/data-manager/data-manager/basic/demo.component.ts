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

import { DATA_MANAGER_DEMO_DATA, DataManagerDemoRow } from './data';
import { FilterModalComponent } from './filter-modal.component';
import { Filters } from './filters';
import { ViewGridComponent } from './view-grid.component';
import { ViewRepeaterComponent } from './view-repeater.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  providers: [SkyDataManagerService, SkyUIConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataManagerModule, ViewGridComponent, ViewRepeaterComponent],
})
export class DemoComponent implements OnInit {
  protected items: DataManagerDemoRow[] = DATA_MANAGER_DEMO_DATA;

  readonly #dataManagerSvc = inject(SkyDataManagerService);

  public ngOnInit(): void {
    this.#dataManagerSvc.initDataManager({
      activeViewId: 'repeaterView',
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
            viewId: 'gridView',
            displayedColumnIds: ['selected', 'name', 'description'],
          },
        ],
      }),
    });
  }
}

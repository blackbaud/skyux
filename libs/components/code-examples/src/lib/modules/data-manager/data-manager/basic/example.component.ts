import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import {
  SkyFilterBarFilterState,
  SkyFilterBarModule,
  SkyFilterItemLookupSearchAsyncArgs,
} from '@skyux/filter-bar';
import { SkyListSummaryModule } from '@skyux/lists';

import { DATA_MANAGER_DEMO_DATA, DataManagerDemoRow } from './data';
import { ExampleService } from './example.service';
import { OrangeModalComponent } from './orange-modal.component';
import { ViewGridComponent } from './view-grid.component';
import { ViewRepeaterComponent } from './view-repeater.component';

/**
 * @title Data manager with basic setup
 */
@Component({
  selector: 'app-data-manager-basic-example',
  templateUrl: './example.component.html',
  providers: [SkyDataManagerService, SkyUIConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDataManagerModule,
    SkyFilterBarModule,
    SkyListSummaryModule,
    ViewGridComponent,
    ViewRepeaterComponent,
  ],
})
export class DataManagerBasicExampleComponent {
  protected readonly items: DataManagerDemoRow[] = DATA_MANAGER_DEMO_DATA;
  protected readonly orangeModalComponent = OrangeModalComponent;

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #exampleSvc = inject(ExampleService);

  constructor() {
    this.#dataManagerSvc.initDataManager({
      activeViewId: 'repeaterView',
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
      defaultDataState: new SkyDataManagerState<SkyFilterBarFilterState>({
        filterData: {
          filtersApplied: true,
          filters: {
            appliedFilters: [
              {
                filterId: 'hideOrange',
                filterValue: {
                  value: true,
                  displayValue: 'True',
                },
              },
            ],
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

  protected onFruitTypeSearchAsync(
    args: SkyFilterItemLookupSearchAsyncArgs,
  ): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the lookup component to cancel the web request if it does not complete
    // before the user searches again.
    args.result = this.#exampleSvc.search(args.searchText);
  }
}

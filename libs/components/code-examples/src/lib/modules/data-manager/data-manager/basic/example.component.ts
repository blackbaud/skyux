import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import {
  SkyFilterBarModule,
  SkyFilterItemLookupSearchAsyncArgs,
} from '@skyux/filter-bar';
import { SkyListSummaryModule } from '@skyux/lists';

import { map } from 'rxjs';

import { DATA_MANAGER_DEMO_DATA, DataManagerDemoRow } from './data';
import { ExampleService } from './example.service';
import { OrangeModalComponent } from './orange-modal.component';
import { ViewGridComponent } from './view-grid.component';
import { ViewRepeaterComponent } from './view-repeater.component';

const SOURCE_ID = 'data_manager_example_id';

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
  protected items: DataManagerDemoRow[] = DATA_MANAGER_DEMO_DATA;
  protected readonly orangeModalComponent = OrangeModalComponent;

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #exampleSvc = inject(ExampleService);

  protected readonly recordCount = toSignal(
    this.#dataManagerSvc
      .getDataSummaryUpdates(SOURCE_ID)
      .pipe(map((summary) => summary.itemsMatching)),
    { initialValue: 0 },
  );

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
      defaultDataState: new SkyDataManagerState({
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

  public onFruitTypeSearchAsync(
    args: SkyFilterItemLookupSearchAsyncArgs,
  ): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the lookup component to cancel the web request if it does not complete
    // before the user searches again.
    args.result = this.#exampleSvc.search(args.searchText);
  }
}

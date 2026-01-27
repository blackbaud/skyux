import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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

import { AG_GRID_DEMO_DATA } from './data';
import { ExampleService } from './example.service';
import { SalesModalComponent } from './sales-modal.component';
import { ViewGridComponent } from './view-grid.component';

const SOURCE_ID = 'data_grid_data_manager_example_id';

/**
 * @title Data manager setup
 */
@Component({
  selector: 'app-ag-grid-data-grid-data-manager-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  imports: [
    SkyDataManagerModule,
    SkyFilterBarModule,
    SkyListSummaryModule,
    ViewGridComponent,
  ],
})
export class AgGridDataGridDataManagerExampleComponent {
  protected items = AG_GRID_DEMO_DATA;
  protected salesModal = SalesModalComponent;

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
      activeViewId: 'dataGridWithDataManagerView',
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
            viewId: 'dataGridWithDataManagerView',
            displayedColumnIds: [
              'context',
              'name',
              'age',
              'startDate',
              'endDate',
              'department',
              'jobTitle',
            ],
          },
        ],
      }),
    });
  }

  public onJobTitleSearchAsync(args: SkyFilterItemLookupSearchAsyncArgs): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the lookup component to cancel the web request if it does not complete
    // before the user searches again.
    args.result = this.#exampleSvc.search(args.searchText);
  }
}

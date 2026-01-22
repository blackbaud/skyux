import { I18nPluralPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { SkyDataGridFilterValue, SkyDataGridModule } from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import {
  SkyFilterBarFilterItem,
  SkyFilterBarModule,
  SkyFilterItemLookupSearchAsyncArgs,
} from '@skyux/filter-bar';
import { SkyListSummaryModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

import { DATA_GRID_DEMO_DATA, DataGridDemoRow } from './data';
import { ExampleService } from './example.service';
import { SalesModalComponent } from './sales-modal.component';

/**
 * @title Data grid with data manager
 */
@Component({
  selector: 'app-data-grid-data-manager-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  imports: [
    I18nPluralPipe,
    SkyDataGridModule,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyFilterBarModule,
    SkyListSummaryModule,
  ],
})
export class DataGridDataManagerExampleComponent {
  protected items = DATA_GRID_DEMO_DATA;
  protected readonly recordCount = model(DATA_GRID_DEMO_DATA.length);
  protected salesModal = SalesModalComponent;
  protected readonly viewId = 'dataGridWithDataManagerView' as const;

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #exampleSvc = inject(ExampleService);

  protected appliedFilters = model<
    SkyFilterBarFilterItem<SkyDataGridFilterValue>[]
  >([]);

  constructor() {
    this.#dataManagerSvc.initDataManager({
      activeViewId: this.viewId,
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        filterData: {
          filters: {},
        },
        views: [
          {
            viewId: this.viewId,
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
    this.#dataManagerSvc.initDataView({
      id: this.viewId,
      name: 'Data Grid View',
      iconName: 'table',
      searchEnabled: true,
      columnPickerEnabled: true,
    });
  }

  protected onJobTitleSearchAsync(
    args: SkyFilterItemLookupSearchAsyncArgs,
  ): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the lookup component to cancel the web request if it does not complete
    // before the user searches again.
    args.result = this.#exampleSvc.search(args.searchText);
  }

  protected actionClicked(row: DataGridDemoRow, action: string): void {
    alert(`${action} clicked for ${row.name}`);
  }
}

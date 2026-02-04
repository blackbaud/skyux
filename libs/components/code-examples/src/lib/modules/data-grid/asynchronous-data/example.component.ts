import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyNumericPipe } from '@skyux/core';
import {
  SkyDataGridModule,
  SkyDataGridNumberRangeFilterValue,
  SkyDataGridPageRequest,
} from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyDatePipe, SkyDateRange } from '@skyux/datetime';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import {
  SkyFilterState,
  SkyFilterStateFilterItem,
  SkyListSummaryModule,
} from '@skyux/lists';

import { Employee, employees } from './data';
import { dataSortAndFilter } from './data-sort-and-filter';
import { HideInactiveFilterModalComponent } from './hide-inactive-filter-modal.component';
import { NameFilterModalComponent } from './name-filter-modal.component';
import { SalaryFilterModalComponent } from './salary-filter-modal.component';
import { StartDateFilterModalComponent } from './start-date-filter-modal.component';

/**
 * @title Asynchronous data loading
 */
@Component({
  selector: 'app-data-grid-asynchronous-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  imports: [
    SkyAgGridModule,
    SkyDataGridModule,
    SkyDataManagerModule,
    SkyDatePipe,
    SkyFilterBarModule,
    SkyListSummaryModule,
    SkyNumericPipe,
  ],
  templateUrl: './example.component.html',
})
export class DataGridAsynchronousDataComponent {
  protected readonly nameFilterModal = NameFilterModalComponent;
  protected readonly salaryFilterModal = SalaryFilterModalComponent;
  protected readonly hideInactiveModal = HideInactiveFilterModalComponent;
  protected readonly startDateFilterModal = StartDateFilterModalComponent;
  protected readonly pageRequest = signal<SkyDataGridPageRequest | undefined>(
    undefined,
  );

  protected readonly viewId = 'dataGridWithCustomFilters' as const;

  // Computed client side in this example, but could be an HTTP resource where parameters are sent to the server for determining data to show.
  protected readonly recordsToShow = resource({
    params: () => ({
      allEmployees: this.#allEmployees(),
      dataManagerUpdates: this.#dataManagerUpdates(),
      pageRequest: this.pageRequest(),
    }),
    loader: ({ params }): Promise<{ data: Employee[] | null; count: number }> =>
      new Promise((resolve) =>
        setTimeout(() => {
          if (params.pageRequest?.pageSize) {
            const pageNumber = params.pageRequest.pageNumber;
            const pageSize = params.pageRequest.pageSize;
            const data = dataSortAndFilter(
              params.allEmployees,
              ((
                params.dataManagerUpdates?.filterData?.filters as
                  | SkyFilterState
                  | undefined
              )?.appliedFilters ?? []) as SkyFilterStateFilterItem<
                | string
                | SkyDataGridNumberRangeFilterValue
                | SkyDateRange
                | boolean
              >[],
              params.dataManagerUpdates?.activeSortOption,
              params.dataManagerUpdates?.searchText ?? '',
            );
            resolve({
              data: data.slice(
                (pageNumber - 1) * pageSize,
                pageNumber * pageSize,
              ),
              count: data.length,
            });
          } else {
            resolve({ data: [], count: 0 });
          }
        }, 800),
      ),
  });

  // Keep the previous row count when the resource is loading.
  protected readonly totalRecordCount = linkedSignal<
    number | undefined,
    number
  >({
    source: () => this.recordsToShow.value()?.count,
    computation: (count, previous) => count ?? previous?.source ?? 0,
  });

  // Static example, but could be loaded from HTTP resource.
  readonly #allEmployees = signal(employees).asReadonly();

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataManagerUpdates = toSignal(
    this.#dataManagerSvc.getDataStateUpdates('dataManagerUpdates'),
  );

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
              'name',
              'department',
              'salary',
              'startDate',
              'active',
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
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyNumericPipe } from '@skyux/core';
import {
  SkyDataGridModule,
  SkyDataGridNumberRangeFilterValue,
  SkyDataGridSort,
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

import { map } from 'rxjs';

import { employees } from './data';
import { dataSortAndFilter } from './data-sort-and-filter';
import { HideInactiveFilterModalComponent } from './hide-inactive-filter-modal.component';
import { NameFilterModalComponent } from './name-filter-modal.component';
import { SalaryFilterModalComponent } from './salary-filter-modal.component';
import { StartDateFilterModalComponent } from './start-date-filter-modal.component';

/**
 * @title Custom filters data grid
 */
@Component({
  selector: 'app-custom-filters-data-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  imports: [
    SkyDataGridModule,
    SkyDataManagerModule,
    SkyFilterBarModule,
    SkyListSummaryModule,
    SkyNumericPipe,
    SkyDatePipe,
  ],
  templateUrl: './example.component.html',
})
export class CustomFilterDataGridComponent {
  protected readonly nameFilterModal = NameFilterModalComponent;
  protected readonly salaryFilterModal = SalaryFilterModalComponent;
  protected readonly hideInactiveModal = HideInactiveFilterModalComponent;
  protected readonly startDateFilterModal = StartDateFilterModalComponent;

  protected sort = signal<SkyDataGridSort | undefined>(undefined);
  protected readonly viewId = 'dataGridWithCustomFilters' as const;

  // Computed client side in this example, but could be an HTTP resource where parameters are sent to the server for determining data to show.
  protected readonly recordsToShow = computed(() => {
    const appliedFilters = this.#dataManagerFilters() ?? [];
    const sort = this.sort();
    const allEmployees = this.#allEmployees();
    const searchText = this.#dataManagerSearchText();
    return dataSortAndFilter(allEmployees, appliedFilters, sort, searchText);
  });

  protected readonly totalRecordCount = computed(
    () => this.recordsToShow().length,
  );

  // Static example, but could be loaded from HTTP resource.
  readonly #allEmployees = signal(employees).asReadonly();

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataManagerFilters = toSignal(
    this.#dataManagerSvc
      .getDataStateUpdates(this.viewId, {
        properties: ['filterData'],
      })
      .pipe(
        map(
          ({ filterData }) =>
            ((filterData?.filters as SkyFilterState | undefined)
              ?.appliedFilters ?? []) as SkyFilterStateFilterItem<
              | string
              | SkyDataGridNumberRangeFilterValue
              | SkyDateRange
              | boolean
            >[],
        ),
      ),
  );
  readonly #dataManagerSearchText = toSignal(
    this.#dataManagerSvc
      .getDataStateUpdates(this.viewId, {
        properties: ['searchText'],
      })
      .pipe(map((state) => `${state.searchText ?? ''}`)),
    { initialValue: '' },
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

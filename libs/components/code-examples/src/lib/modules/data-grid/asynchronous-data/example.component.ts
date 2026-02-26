import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyNumericPipe } from '@skyux/core';
import { SkyDataGridModule, SkyDataGridPageRequest } from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyDatePipe } from '@skyux/datetime';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import { SkyListSummaryModule } from '@skyux/lists';

import { switchMap } from 'rxjs';

import { remoteService } from './data';
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
    SkyDataGridModule,
    SkyDataManagerModule,
    SkyDatePipe,
    SkyFilterBarModule,
    SkyListSummaryModule,
    SkyNumericPipe,
    AsyncPipe,
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
  readonly #requestParameters = toObservable(
    computed(() => ({
      dataManagerUpdates: this.#dataManagerUpdates(),
      pageRequest: this.pageRequest(),
    })),
  );
  protected readonly recordsToShow = this.#requestParameters.pipe(
    switchMap(remoteService),
  );

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

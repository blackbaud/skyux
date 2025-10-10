import { Directive, OnDestroy, OnInit, inject } from '@angular/core';
import { SkyFilterAdapterData, SkyFilterAdapterService } from '@skyux/lists';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';

import { SkyDataManagerFilterAdapterService } from './data-manager-filter-adapter.service';

/**
 * A directive applied to a filtering component that enables integration with a data manager.
 */
@Directive({
  selector: '[skyDataManagerFilterController]',
  standalone: true,
  providers: [
    SkyDataManagerFilterAdapterService,
    {
      provide: SkyFilterAdapterService,
      useExisting: SkyDataManagerFilterAdapterService,
    },
  ],
})
export class SkyDataManagerFilterControllerDirective
  implements OnInit, OnDestroy
{
  #currentDataState!: SkyDataManagerState;
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #adapterService = inject(SkyFilterAdapterService);
  readonly #ngUnsubscribe = new Subject<void>();
  readonly #sourceId = 'skyDataManagerFilterController';

  public ngOnInit(): void {
    // Subscribe to data manager state changes to update the adapter
    this.#dataManagerService
      .getDataStateUpdates(this.#sourceId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((dataState: SkyDataManagerState) => {
        this.#currentDataState = dataState;
        this.#updateAdapterFromDataState(dataState);
      });

    // Subscribe to adapter changes (excluding those this controller originated)
    this.#adapterService
      .getFilterDataUpdates(this.#sourceId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((data: SkyFilterAdapterData) => {
        this.#updateDataManagerFromAdapter(data);
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Updates the adapter's applied filters based on the data manager state.
   */
  #updateAdapterFromDataState(dataState: SkyDataManagerState): void {
    if (dataState.filterData?.filters) {
      this.#adapterService.updateFilterData(
        dataState.filterData.filters,
        this.#sourceId,
      );
    }
  }

  /**
   * Updates the data manager state based on adapter changes.
   */
  #updateDataManagerFromAdapter(
    filters: SkyFilterAdapterData | undefined,
  ): void {
    const filterData = {
      filtersApplied: !!(
        filters?.appliedFilters && filters.appliedFilters.length > 0
      ),
      filters,
    };
    this.#currentDataState.filterData = filterData;

    // Update the data manager state
    this.#dataManagerService.updateDataState(
      this.#currentDataState,
      this.#sourceId,
    );
  }
}

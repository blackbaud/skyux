import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyFilterState, SkyFilterStateService } from '@skyux/lists';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';

import { SkyDataManagerFilterStateService } from './data-manager-filter-state.service';

/**
 * A directive applied to a filtering component that enables integration with a data manager.
 */
@Directive({
  selector: '[skyDataManagerFilterController]',
  providers: [
    SkyDataManagerFilterStateService,
    {
      provide: SkyFilterStateService,
      useExisting: SkyDataManagerFilterStateService,
    },
  ],
})
export class SkyDataManagerFilterControllerDirective implements OnInit {
  #currentDataState = new SkyDataManagerState({});
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #adapterService = inject(SkyFilterStateService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #sourceId = 'skyDataManagerFilterController';

  public ngOnInit(): void {
    // Subscribe to data manager state changes to update the adapter
    this.#dataManagerService
      .getDataStateUpdates(this.#sourceId)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((dataState: SkyDataManagerState) => {
        this.#currentDataState = dataState;
        this.#updateAdapterFromDataState(dataState);
      });

    // Subscribe to adapter changes (excluding those this controller originated)
    this.#adapterService
      .getFilterStateUpdates(this.#sourceId)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((data: SkyFilterState) => {
        this.#updateDataManagerFromAdapter(data);
      });
  }

  /**
   * Updates the adapter's applied filters based on the data manager state.
   */
  #updateAdapterFromDataState(dataState: SkyDataManagerState): void {
    if (dataState.filterData?.filters) {
      this.#adapterService.updateFilterState(
        dataState.filterData.filters,
        this.#sourceId,
      );
    }
  }

  /**
   * Updates the data manager state based on adapter changes.
   */
  #updateDataManagerFromAdapter(filters: SkyFilterState | undefined): void {
    const filterData = {
      filtersApplied: !!(
        filters?.appliedFilters && filters.appliedFilters.length > 0
      ),
      filters,
    };

    // Build a new state rather than mutating `#currentDataState` in place. The data manager
    // service hands the same state instance to every subscriber, so mutating it directly would
    // corrupt the "previous" value that other subscribers' distinctUntilChanged comparisons rely
    // on, silently dropping this update for them.
    const options = this.#currentDataState.getStateOptions();
    options.filterData = filterData;

    const newDataState = new SkyDataManagerState(options);
    this.#currentDataState = newDataState;

    // Update the data manager state
    this.#dataManagerService.updateDataState(newDataState, this.#sourceId);
  }
}

import { Injectable } from '@angular/core';
import { SkyFilterState, SkyFilterStateService } from '@skyux/lists';

import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface SkyFilterStateChange {
  filterState: SkyFilterState;
  sourceId: string;
}

/**
 * Concrete implementation of SkyFilterStateService that manages filter state
 * for integration between list components and data managers.
 * @internal
 */
@Injectable()
export class SkyDataManagerFilterStateService implements SkyFilterStateService {
  readonly #filterStateChange = new ReplaySubject<SkyFilterStateChange>(1);

  public updateFilterState(data: SkyFilterState, sourceId: string): void {
    const nextState: SkyFilterState = {
      appliedFilters: data.appliedFilters,
      selectedFilterIds: data.selectedFilterIds,
    };

    this.#filterStateChange.next({
      filterState: nextState,
      sourceId: sourceId,
    });
  }

  public getFilterStateUpdates(sourceId: string): Observable<SkyFilterState> {
    return this.#filterStateChange.pipe(
      filter((c) => c.sourceId !== sourceId),
      map((c) => c.filterState),
    );
  }
}

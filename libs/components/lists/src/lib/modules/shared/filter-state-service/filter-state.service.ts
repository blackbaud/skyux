import { Observable } from 'rxjs';

import { SkyFilterState } from './filter-state';

/**
 * Abstract service that provides an interface for components to integrate with a data manager.
 * This allows various list and filter components to work with data managers without tight coupling.
 * @internal
 */
export abstract class SkyFilterStateService {
  /**
   * Subscribe to filter data updates that did not originate from the given source ID.
   * This mirrors the data manager service pattern to avoid update loops between participants.
   */
  public abstract getFilterStateUpdates(
    sourceId: string,
  ): Observable<SkyFilterState>;

  /**
   * Updates the filter adapter data and broadcasts the change to subscribers.
   * Implementations should emit a new value to `filterStateChange` with the provided data.
   */
  public abstract updateFilterState(
    state: SkyFilterState,
    sourceId: string,
  ): void;
}

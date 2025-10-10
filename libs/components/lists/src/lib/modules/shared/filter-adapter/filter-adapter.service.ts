import { Observable } from 'rxjs';

import { SkyFilterAdapterData } from './filter-adapter-data';

/**
 * Abstract service that provides an interface for components to integrate with a data manager.
 * This allows various list and filter components to work with data managers without tight coupling.
 * @internal
 */
export abstract class SkyFilterAdapterService {
  /**
   * Subscribe to filter data updates that did not originate from the given source ID.
   * This mirrors the data manager service pattern to avoid update loops between participants.
   */
  public abstract getFilterDataUpdates(
    sourceId: string,
  ): Observable<SkyFilterAdapterData>;

  /**
   * Updates the filter adapter data and broadcasts the change to subscribers.
   * Implementations should emit a new value to `filterDataChange` with the provided data.
   */
  public abstract updateFilterData(
    data: SkyFilterAdapterData,
    sourceId: string,
  ): void;
}

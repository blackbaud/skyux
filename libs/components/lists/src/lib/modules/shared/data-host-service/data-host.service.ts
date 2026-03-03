import { Signal } from '@angular/core';

import { Observable } from 'rxjs';

import { SkyDataHost } from './data-host';

export abstract class SkyDataHostService {
  public abstract hostId: Signal<string>;

  /**
   * Subscribe to data host updates that did not originate from the given source ID.
   * This mirrors the data manager service pattern to avoid update loops between participants.
   */
  public abstract getDataHostUpdates(sourceId: string): Observable<SkyDataHost>;

  /**
   * Updates the data hosts and broadcasts the change to subscribers.
   * Implementations should emit a new value to `filterStateChange` with the provided data.
   */
  public abstract updateDataHost(host: SkyDataHost, sourceId: string): void;
}

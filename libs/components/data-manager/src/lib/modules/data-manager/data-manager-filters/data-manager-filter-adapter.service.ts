import { Injectable } from '@angular/core';
import { SkyFilterAdapterData, SkyFilterAdapterService } from '@skyux/lists';

import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface SkyFilterAdapterDataChange {
  data: SkyFilterAdapterData;
  source: string;
}

/**
 * Concrete implementation of SkyFilterAdapterService that manages filter state
 * for integration between list components and data managers.
 * @internal
 */
@Injectable()
export class SkyDataManagerFilterAdapterService
  implements SkyFilterAdapterService
{
  readonly #filterDataChange = new ReplaySubject<SkyFilterAdapterDataChange>(1);

  public updateFilterData(data: SkyFilterAdapterData, sourceId: string): void {
    const nextData: SkyFilterAdapterData = {
      appliedFilters: data.appliedFilters,
      selectedFilterIds: data.selectedFilterIds,
    };

    this.#filterDataChange.next({ data: nextData, source: sourceId });
  }

  public getFilterDataUpdates(
    sourceId: string,
  ): Observable<SkyFilterAdapterData> {
    return this.#filterDataChange.pipe(
      filter((c) => c.source !== sourceId),
      map((c) => c.data),
    );
  }
}

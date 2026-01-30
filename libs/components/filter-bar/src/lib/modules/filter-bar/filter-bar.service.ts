import { Injectable } from '@angular/core';

import { Observable, ReplaySubject, Subject, filter, map } from 'rxjs';

import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';
import { SkyFilterBarFilterValue } from './models/filter-bar-filter-value';

/**
 * Service for filter items to emit value changes to the filter bar.
 * @internal
 */
@Injectable()
export class SkyFilterBarService {
  readonly #filterItemUpdates = new Subject<SkyFilterBarFilterItem>();
  readonly #filterValueUpdates = new ReplaySubject<SkyFilterBarFilterItem>();

  /**
   * Observable stream of filter item updates.
   */
  public readonly filterItemUpdated: Observable<SkyFilterBarFilterItem> =
    this.#filterItemUpdates.asObservable();

  /**
   * Filtered observable stream of filter value updates.
   * @param filterId the
   * @returns
   */
  public getFilterValueUpdates<TValue = unknown>(
    filterId: string,
  ): Observable<SkyFilterBarFilterValue<TValue> | undefined> {
    return this.#filterValueUpdates.pipe(
      filter((update) => update.filterId === filterId),
      map((item) => item.filterValue as SkyFilterBarFilterValue<TValue>),
    );
  }
  /**
   * Emit a filter value update.
   */
  public updateFilter(filter: SkyFilterBarFilterItem): void {
    this.#filterItemUpdates.next(filter);
  }

  public updateFilters(filters: SkyFilterBarFilterItem[]): void {
    for (const filter of filters) {
      this.#filterValueUpdates.next(filter);
    }
  }
}

import { Injectable } from '@angular/core';
import {
  SkyFilterAdapterData,
  SkyFilterAdapterFilterItem,
  SkyFilterAdapterService,
} from '@skyux/lists';

import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

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
    const compare = this.#defaultComparator.bind(this);
    return this.#filterDataChange.pipe(
      filter((c) => c.source !== sourceId),
      map((c) => c.data),
      distinctUntilChanged(compare),
    );
  }

  #defaultComparator(
    a: SkyFilterAdapterData,
    b: SkyFilterAdapterData,
  ): boolean {
    // Fast path: reference equality.
    if (a === b) {
      return true;
    }

    const filtersEqual = this.#areAppliedFiltersEqual(
      a.appliedFilters,
      b.appliedFilters,
    );
    if (!filtersEqual) {
      return false;
    }

    const selectedIdsEqual = this.#areSelectedIdsEqual(
      a.selectedFilterIds,
      b.selectedFilterIds,
    );
    return selectedIdsEqual;
  }

  /**
   * Compares two arrays of selected filter IDs as ordered collections.
   * Order is significant: ['a','b'] !== ['b','a'].
   */
  #areSelectedIdsEqual(
    idsA: string[] | undefined,
    idsB: string[] | undefined,
  ): boolean {
    if (idsA === idsB) return true;
    if (!idsA && !idsB) return true;
    if (!idsA || !idsB) return false;
    const len = idsA.length;
    if (len !== idsB.length) return false;
    for (let i = 0; i < len; i++) {
      if (idsA[i] !== idsB[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Compares two arrays of applied filter items. Order is ignored (sorted by filterId for comparison).
   * Performs cheap structural comparisons of primitive properties before falling back to JSON stringify
   * ONLY for complex nested values where necessary.
   */
  #areAppliedFiltersEqual(
    filtersA: SkyFilterAdapterFilterItem[] | undefined,
    filtersB: SkyFilterAdapterFilterItem[] | undefined,
  ): boolean {
    if (filtersA === filtersB) return true;
    if (!filtersA && !filtersB) return true;
    if (!filtersA || !filtersB) return false;
    if (filtersA.length !== filtersB.length) return false;
    if (filtersA.length === 0) return true;

    const sortedA = this.#sortFilters(filtersA);
    const sortedB = this.#sortFilters(filtersB);
    return this.#compareSortedFilters(sortedA, sortedB);
  }

  #areFilterValuesEqual(
    va: { value: unknown; displayValue?: string } | undefined,
    vb: { value: unknown; displayValue?: string } | undefined,
  ): boolean {
    if (va === vb) return true;
    if (!va || !vb) return !va && !vb;
    if (va.displayValue !== vb.displayValue) return false;
    return this.#compareFilterCoreValues(va.value, vb.value);
  }

  #compareFilterCoreValues(aVal: unknown, bVal: unknown): boolean {
    if (aVal === bVal) return true;
    if (this.#areBothPrimitiveLike(aVal, bVal)) return Object.is(aVal, bVal);
    if (Array.isArray(aVal) && Array.isArray(bVal)) {
      return this.#comparePrimitiveArrayShallow(aVal, bVal);
    }
    if (this.#isPlainObject(aVal) && this.#isPlainObject(bVal)) {
      return this.#comparePlainObjectShallow(
        aVal as Record<string, unknown>,
        bVal as Record<string, unknown>,
      );
    }
    if (aVal instanceof Date && bVal instanceof Date) {
      return aVal.getTime() === bVal.getTime();
    }
    return this.#fallbackJsonCompare(aVal, bVal);
  }

  #isPlainObject(obj: unknown): obj is Record<string, unknown> {
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
  }

  #sortFilters(
    filters: SkyFilterAdapterFilterItem[],
  ): SkyFilterAdapterFilterItem[] {
    return [...filters].sort((a, b) => a.filterId.localeCompare(b.filterId));
  }

  #compareSortedFilters(
    a: SkyFilterAdapterFilterItem[],
    b: SkyFilterAdapterFilterItem[],
  ): boolean {
    for (let i = 0; i < a.length; i++) {
      if (a[i].filterId !== b[i].filterId) return false;
      if (!this.#areFilterValuesEqual(a[i].filterValue, b[i].filterValue)) {
        return false;
      }
    }
    return true;
  }

  #areBothPrimitiveLike(a: unknown, b: unknown): boolean {
    return (
      (a === null || typeof a !== 'object') &&
      (b === null || typeof b !== 'object')
    );
  }

  #comparePrimitiveArrayShallow(a: unknown[], b: unknown[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const av = a[i];
      const bv = b[i];
      if (this.#areBothPrimitiveLike(av, bv)) {
        if (!Object.is(av, bv)) return false;
      } else {
        // Nested structures -> fallback once.
        return this.#fallbackJsonCompare(a, b);
      }
    }
    return true;
  }

  #comparePlainObjectShallow(
    a: Record<string, unknown>,
    b: Record<string, unknown>,
  ): boolean {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      const av = a[k];
      const bv = b[k];
      if (this.#areBothPrimitiveLike(av, bv)) {
        if (!Object.is(av, bv)) return false;
      } else {
        return this.#fallbackJsonCompare(a, b);
      }
    }
    return true;
  }

  #fallbackJsonCompare(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}

import { Signal } from '@angular/core';

import { SkyDataSort } from './data-sort';

/**
 * Implemented by components that sort their data, such as a data grid, so that
 * a container can store the sort users apply and restore it later, without
 * depending on the component itself.
 * @internal
 */
export abstract class SkyDataSortSource {
  /**
   * The sort the component applies, or `undefined` when its data is not sorted.
   */
  public abstract readonly sort: Signal<SkyDataSort | undefined>;

  /**
   * Sets the sort the component applies.
   */
  public abstract setSort(sort: SkyDataSort | undefined): void;
}

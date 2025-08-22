import { SkyFilterState } from '@skyux/lists';

export type SkyDataManagerExtensionsFilterState = SkyFilterState;

export interface SkyDataManagerStateExtensions {
  /**
   * Stores data for filter bar filters.
   */
  filterState?: SkyDataManagerExtensionsFilterState;
}

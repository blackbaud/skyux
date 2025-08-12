import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * A configuration object for how a filter is displayed on the filter bar.
 * @internal
 */
export interface SkyFilterBarItem {
  /**
   * A unique identifier for the filter.
   */
  id: string;
  /**
   * The human-readable display string for the filter.
   */
  name: string;
  /**
   * The value of the filter, if it is set.
   */
  filterValue?: SkyFilterBarFilterValue;
}

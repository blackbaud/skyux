import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * An internal representation of a filter item displayed on the filter bar.
 * @internal
 */
export interface SkyFilterBarItem {
  /**
   * A unique identifier for the filter.
   */
  filterId: string;
  /**
   * The human-readable display string for the filter.
   */
  labelText: string;
  /**
   * The value of the filter, if it is set.
   */
  filterValue?: SkyFilterBarFilterValue;
}

import { SkyFilterStateFilterValue } from './filter-state-filter-value';

/**
 * Represents a filter item that can be applied to data.
 */
export interface SkyFilterStateFilterItem {
  /**
   * A unique identifier for the filter item.
   */
  filterId: string;
  /**
   * The value of the filter item.
   */
  filterValue?: SkyFilterStateFilterValue;
}

import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * Represents a specific filter item and its selected value, if any.
 */
export interface SkyFilterBarFilterItem {
  /**
   * A unique identifier for the filter item.
   */
  filterId: string;
  /**
   * The value of the filter item.
   */
  filterValue?: SkyFilterBarFilterValue;
}

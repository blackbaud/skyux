import { SkyFilterStateValue } from './filter-state-value';

/**
 * Represents a specific filter item and its selected value, if any.
 */
export interface SkyFilterStateItem {
  /**
   * A unique identifier for the filter item.
   */
  filterId: string;
  /**
   * The value of the filter item.
   */
  filterValue?: SkyFilterStateValue;
}

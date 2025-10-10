import { SkyFilterAdapterFilterValue } from './filter-adapter-filter-value';

/**
 * Represents a filter item that can be applied to data.
 */
export interface SkyFilterAdapterFilterItem {
  /**
   * A unique identifier for the filter item.
   */
  filterId: string;
  /**
   * The value of the filter item.
   */
  filterValue?: SkyFilterAdapterFilterValue;
}

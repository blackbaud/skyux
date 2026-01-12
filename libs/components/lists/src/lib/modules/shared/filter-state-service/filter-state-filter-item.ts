import { SkyFilterStateFilterValue } from './filter-state-filter-value';

/**
 * Represents a filter item that can be applied to data.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 */
export interface SkyFilterStateFilterItem<TValue = unknown> {
  /**
   * A unique identifier for the filter item.
   */
  filterId: string;
  /**
   * The value of the filter item.
   */
  filterValue?: SkyFilterStateFilterValue<TValue>;
}

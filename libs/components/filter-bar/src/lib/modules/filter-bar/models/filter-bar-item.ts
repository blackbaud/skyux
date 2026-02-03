import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * An internal representation of a filter item displayed on the filter bar.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 * @internal
 */
export interface SkyFilterBarItem<TValue = unknown> {
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
  filterValue?: SkyFilterBarFilterValue<TValue>;
}

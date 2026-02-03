import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * Arguments passed back from a filter modal when the user has saved.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 */
export interface SkyFilterItemModalSavedArgs<TValue = unknown> {
  /**
   * The filter value.
   */
  filterValue: SkyFilterBarFilterValue<TValue> | undefined;
}

import { SkyFilterStateFilterItem } from '@skyux/lists';

import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * Represents a specific filter item and its selected value, if any.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 */
export interface SkyFilterBarFilterItem<
  TValue = unknown,
> extends SkyFilterStateFilterItem<TValue> {
  /**
   * The value of the filter item.
   */
  filterValue?: SkyFilterBarFilterValue<TValue>;
}

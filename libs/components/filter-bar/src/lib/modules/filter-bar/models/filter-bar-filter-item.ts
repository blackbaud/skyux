import { SkyFilterStateFilterItem } from '@skyux/lists';

import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * Represents a specific filter item and its selected value, if any.
 */
export interface SkyFilterBarFilterItem extends SkyFilterStateFilterItem {
  filterValue?: SkyFilterBarFilterValue;
}

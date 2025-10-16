import { SkyFilterStateFilterItem } from './filter-state-filter-item';

/**
 * Represents the complete filter state containing both applied filters and selected filter IDs.
 */
export interface SkyFilterState {
  /**
   * An array of filter items containing the IDs and values of the filters that have been applied.
   */
  appliedFilters?: SkyFilterStateFilterItem[];

  /**
   * An array of filter IDs that the user has selected (for components that support filter selection).
   */
  selectedFilterIds?: string[];
}

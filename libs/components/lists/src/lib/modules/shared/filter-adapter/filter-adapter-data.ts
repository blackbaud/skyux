import { SkyFilterAdapterFilterItem } from './filter-adapter-filter-item';

/**
 * Represents the complete filter adapter data containing both applied filters and selected filter IDs.
 */
export interface SkyFilterAdapterData {
  /**
   * An array of filter items containing the IDs and values of the filters that have been applied.
   */
  appliedFilters?: SkyFilterAdapterFilterItem[];

  /**
   * An array of filter IDs that the user has selected (for components that support filter selection).
   */
  selectedFilterIds?: string[];
}

import { SkyFilterStateItem } from './filter-state-item';

/**
 * Represents the current filter state.
 */
export interface SkyFilterState {
  /**
   * The filters that have been set.
   */
  filters?: SkyFilterStateItem[];
  /**
   * The filters that have been selected.
   */
  selectedFilterIds?: string[];
}

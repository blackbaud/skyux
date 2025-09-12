import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * Arguments passed back from a filter modal when the user has saved.
 */
export interface SkyFilterItemModalSavedArgs {
  /**
   * The filter value.
   */
  filterValue: SkyFilterBarFilterValue | undefined;
}

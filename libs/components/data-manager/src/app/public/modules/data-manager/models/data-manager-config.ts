import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

/**
 * The data manager config contains settings that apply to the data manager across all views, like
 * the sort and filter settings.
 */
export interface SkyDataManagerConfig {
  /**
   * An untyped property that can be used to keep track of any config information relevant to a
   * data manager that is not included in the existing options.
   */
  additionalOptions?: any;
  /**
   * The modal component to launch when the filter button is clicked. The same filter options are
   * used for all views, but views can indicate via their `SkyDataViewConfig` whether or not the
   * filter button should be shown. The modal will receive the `filterData` in the data state as context.
   */
  filterModalComponent?: any;
  /**
   * The sort options displayed in the sort dropdown. The same sort options are used for all views,
   * but views can indicate via their `SkyDataViewConfig` whether or not the sort button should be shown.
   */
  sortOptions?: SkyDataManagerSortOption[];
}

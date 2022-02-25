import { SkyDataManagerSortOption } from './data-manager-sort-option';

/**
 * The data manager config contains settings that apply to the data manager across all views,
 * such as the sort and filter settings.
 */
export interface SkyDataManagerConfig {
  /**
   * An untyped property that can track any config information relevant to a
   * data manager that existing options do not include.
   */
  additionalOptions?: any;
  /**
   * The modal component to launch when the filter button is selected. The same filter options are
   * used for all views, but views can use `SkyDataViewConfig` to indicate whether to display
   * the filter button. The modal receives the `filterData` in the data state as context.
   */
  filterModalComponent?: any;
  /**
   * The sort options displayed in the sort dropdown. The same sort options are used for all views,
   * but views can use `SkyDataViewConfig` to indicate whether to display the sort button.
   */
  sortOptions?: SkyDataManagerSortOption[];
}

import { SkyDataManagerSortOption } from './data-manager-sort-option';

/**
 * The data manager config contains settings that apply to the data manager across all views,
 * such as the sort and filter settings.
 * @tags data-manager
 */
export interface SkyDataManagerConfig {
  /**
   * An untyped property that can track any config information relevant to a
   * data manager that existing options do not include.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalOptions?: any;
  /**
   * The modal component to launch when the filter button is selected. The same filter options are
   * used for all views, but views can use `SkyDataViewConfig` to indicate whether to display
   * the filter button. The modal receives the `filterData` in the data state as context.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterModalComponent?: any;
  /**
   * A descriptor for the data that the data manager manipulates. Use a plural term. The descriptor helps set the data manager's `aria-label` attributes for multiselect toolbars, search inputs, sort buttons, and filter buttons to provide text equivalents for screen readers [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * For example, when the descriptor is "constituents," the search input's `aria-label` is "Search constituents." For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  listDescriptor?: string;
  /**
   * The sort options displayed in the sort dropdown. The same sort options are used for all views,
   * but views can use `SkyDataViewConfig` to indicate whether to display the sort button.
   */
  sortOptions?: SkyDataManagerSortOption[];
}

import { SkyDataManagerColumnPickerOption } from './data-manager-column-picker-option';

import { SkyDataManagerColumnPickerSortStrategy } from './data-manager-column-picker-sort-strategy';

/**
 * The data view config contains settings that apply to the specific view, such as
 * column picker options and the buttons to display in the toolbar.
 */
export interface SkyDataViewConfig {
  /**
   * An untyped property that can track any view config information relevant to a
   * data view that the existing options do not include.
   */
  additionalOptions?: Object;
  /**
   * The column data to pass to the column picker. Columns that are always displayed should be
   * passed in addition to the optional columns. See SkyDataManagerColumnPickerOption.
   */
  columnOptions?: SkyDataManagerColumnPickerOption[];
  /**
   * Indicates whether to display the column picker button for this view.
   */
  columnPickerEnabled?: boolean;
  /**
   * The strategy used to sort the options in the column picker. If no strategy is provided the columns will be sorted
   * by selected then alphabetical.
   */
  columnPickerSortStrategy?: SkyDataManagerColumnPickerSortStrategy;
  /**
   * Inidicates whether to display the filter button for this view.
   */
  filterButtonEnabled?: boolean;
  /**
   * The Font Awesome icon name to use for this view in the view switcher.
   * Required if you have more than one view. Do not include the `fa-` prefix.
   */
  icon?: string;
  /**
   * The unique ID for this view.
   */
  id: string;
  /**
   * Indicates whether to display the multiselect toolbar for this view.
   */
  multiselectToolbarEnabled?: boolean;
  /**
   * The name of the view. This is used in the ARIA label for the view switcher.
   */
  name: string;
  /**
   * The function called when a user selects the "Clear all" button on the multi-select toolbar.
   * Update your displayed data to indicate it is not selected in this function.
   */
  onClearAllClick?: Function;
  /**
   * The function called when a user selects the "Select all" button on the multi-select toolbar.
   * Update your displayed data to indicate it is selected in this function.
   */
  onSelectAllClick?: Function;
  /**
   * Indicates whether to display the search box for this view.
   */
  searchEnabled?: boolean;
  /**
   * Specifies placeholder text to display in the search input until users enter search criteria.
   * See the <a href="https://developer.blackbaud.com/skyux/components/search">search component</a> for the default value.
   */
  searchPlaceholderText?: string;
  /**
   * Sets the `expandMode` property on the search box for this view.
   * See the <a href="https://developer.blackbaud.com/skyux/components/search">search component</a> for valid options and the default value.
   */
  searchExpandMode?: string;
  /**
   * Indicates whether to include the "Filter" text on the displayed filter button for this view.
   * If it is not set, no text appears.
   */
  showFilterButtonText?: boolean;
  /**
   * Indicates whether to include the "Sort" text on the displayed sort button for this view.
   * If it is not set, no text appears.
   */
  showSortButtonText?: boolean;
  /**
   * Indicates whether to display the sort button in this view.
   */
  sortEnabled?: boolean;
}

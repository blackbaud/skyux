import {
  SkyDataManagerColumnPickerOption
} from './data-manager-column-picker-option';

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
   * Sets the `expandMode` property on the search box for this view. The valid options
   * are `responsive`, `fit`, and `none`. The default is `responsive`.
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

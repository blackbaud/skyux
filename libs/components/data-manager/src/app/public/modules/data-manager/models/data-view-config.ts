import {
  SkyDataManagerColumnPickerOption
} from './data-manager-column-picker-option';

/**
 * The data view config contains settings that apply to the specific view, like
 * column picker options and what buttons to display in the toolbar.
 */
export interface SkyDataViewConfig {
  /**
   * An untyped property that can be used to keep track of any view config information relevant to a
   * data view that is not included in the existing options.
   */
  additionalOptions?: Object;
  /**
   * The column data to pass to the column picker. Columns that should always be displayed should be
   * passed in addition to the optional columns. See SkyDataManagerColumnPickerOption.
   */
  columnOptions?: SkyDataManagerColumnPickerOption[];
  /**
   * Indicates if the column picker button should be displayed for this view.
   */
  columnPickerEnabled?: boolean;
  /**
   * Inidicates if the filter button should be displayed for this view.
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
   * Indicates if the multiselect toolbar should be displayed for this view.
   */
  multiselectToolbarEnabled?: boolean;
  /**
   * The name of the view. This is used in the ARIA label for the view switcher.
   */
  name: string;
  /**
   * The function called when a user clicks the "Clear all" button on the multi-select toolbar.
   * Update your displayed data to indicate it is not selected in this function.
   */
  onClearAllClick?: Function;
  /**
   * The function called when a user clicks the "Select all" button on the multi-select toolbar.
   * Update your displayed data to indicate it is selected in this function.
   */
  onSelectAllClick?: Function;
  /**
   * Indicates if the search box should be displayed for this view.
   */
  searchEnabled?: boolean;
  /**
   * Sets the `expandMode` property on the search box for this view.
   * It can be 'responsive', 'fit', or 'none'. If not set the default is 'responsive'.
   */
  searchExpandMode?: string;
  /**
   * Indicates if the displayed filter button for this view should include the "Filter" text. If it is not set no text will display.
   */
  showFilterButtonText?: boolean;
  /**
   * Indicates if the displayed sort button for this view should include the "Sort" text. If it is not set no text will display.
   */
  showSortButtonText?: boolean;
  /**
   * Indicates if the sort button should be displayed in this view.
   */
  sortEnabled?: boolean;
}

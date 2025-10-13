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
  additionalOptions?: Record<string, unknown>;
  /**
   * The column data to pass to the column picker. Columns that are always displayed should be
   * passed in addition to the optional columns. See SkyDataManagerColumnPickerOption.
   */
  columnOptions?: SkyDataManagerColumnPickerOption[];
  /**
   * Whether to display the column picker button for this view.
   */
  columnPickerEnabled?: boolean;
  /**
   * The strategy used to sort the options in the column picker. If no strategy is provided the columns will be sorted
   * by selected then alphabetical.
   */
  columnPickerSortStrategy?: SkyDataManagerColumnPickerSortStrategy;
  /**
   * Whether to display the filter button for this view.
   */
  filterButtonEnabled?: boolean;

  /**
   * The name of the Blackbaud SVG icon to display for this view in the view switcher.
   * Required if you have more than one view.
   */
  iconName?: string;
  /**
   * The unique ID for this view.
   */
  id: string;
  /**
   * Whether to display the multiselect toolbar for this view.
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
  onClearAllClick?: () => void;
  /**
   * The function called when a user selects the "Select all" button on the multi-select toolbar.
   * Update your displayed data to indicate it is selected in this function.
   */
  onSelectAllClick?: () => void;
  /**
   * Whether to display the search box for this view.
   */
  searchEnabled?: boolean;
  /**
   * Placeholder text to display in the search input until users enter search criteria.
   * See the [search component](https://developer.blackbaud.com/skyux/components/search) for the default value.
   */
  searchPlaceholderText?: string;
  /**
   * Sets the `expandMode` property on the search box for this view.
   * See the [search component](https://developer.blackbaud.com/skyux/components/search) for valid options and the default value.
   */
  searchExpandMode?: string;
  /**
   * Highlights text that matches the search text using the text highlight directive.
   */
  searchHighlightEnabled?: boolean;
  /**
   * Whether to include the "Filter" text on the displayed filter button for this view.
   * If it is not set, no text appears.
   */
  showFilterButtonText?: boolean;
  /**
   * Whether to include the "Sort" text on the displayed sort button for this view.
   * If it is not set, no text appears.
   */
  showSortButtonText?: boolean;
  /**
   * Whether to display the sort button in this view.
   */
  sortEnabled?: boolean;
}

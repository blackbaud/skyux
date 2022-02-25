/**
 * The options to display in a view's column picker.
 */
export interface SkyDataManagerColumnPickerOption {
  /**
   * Indicates that a column is always visible and should not be listed as an option in the column
   * picker. For example, a context menu column may always be visible.
   */
  alwaysDisplayed?: boolean;
  /**
   * The description text rendered beneath the column label in the column picker.
   */
  description?: string;
  /**
   * Initially hide the column when it is added to the grid unless given in the view state's
   * `displayedColumnIds`. When enabled, this column will not be automatically added to a view's
   * state when this column is recognized as being missing from an initial data state or a data
   * state returned via the SKY UI config service.
   */
  initialHide?: boolean;
  /**
   * The ID of the corresponding column.
   * @required
   */
  id: string;
  /**
   * The label to display in the column picker.
   * @required
   */
  label: string;
}

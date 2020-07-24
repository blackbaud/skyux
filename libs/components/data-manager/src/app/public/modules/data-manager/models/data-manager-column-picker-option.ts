/**
 * The options to be displayed in a view's column picker.
 */
export interface SkyDataManagerColumnPickerOption {
  /**
   * Indicates that a column is always visible and should not be listed as an option in the column picker
   * but should be included in the grid, for example a context menu column.
   */
  alwaysDisplayed?: boolean;
  /**
   * The description text rendered beneath the column label in the column picker.
   */
  description?: string;
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

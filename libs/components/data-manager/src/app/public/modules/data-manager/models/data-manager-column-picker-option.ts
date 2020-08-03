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

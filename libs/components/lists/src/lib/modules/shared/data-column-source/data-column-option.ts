/**
 * Describes a column that a column-based component can display.
 * @preview
 */
export interface SkyDataColumnOption {
  /**
   * Whether the column is always visible and is not offered as an option in a
   * column picker. For example, a context menu column may always be visible.
   */
  alwaysDisplayed?: boolean;
  /**
   * The description text rendered beneath the column label in a column picker.
   */
  description?: string;
  /**
   * The unique ID of the column.
   * @required
   */
  id: string;
  /**
   * Whether the column starts hidden. A column that is added after a column
   * state has been stored displays automatically unless this is `true`.
   */
  initialHide?: boolean;
  /**
   * The label to display for the column in a column picker.
   * @required
   */
  labelText: string;
}

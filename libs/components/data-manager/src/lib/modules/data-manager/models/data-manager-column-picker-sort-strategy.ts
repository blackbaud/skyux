/**
 * These options specify the sorting strategy applied to columns when `columnPickerEnabled` is enabled.
 */
export enum SkyDataManagerColumnPickerSortStrategy {
  /**
   * No sorting is applied to the columns.
   */
  None = 'none',
  /**
   * If `sortEnabled` is set to `true`, then the selected columns are displayed before the unselected columns. Unselected columns are sorted alphabetically.
   * If `sortEnabled` is set to `false`, then the columns are displayed in the order specified by `columnOptions`.
   */
  SelectedThenAlphabetical = 'selectedThenAlphabetical',
}

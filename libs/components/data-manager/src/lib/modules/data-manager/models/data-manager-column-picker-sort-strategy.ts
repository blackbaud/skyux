/**
 * These options specify the sorting applied to columns.
 */
export enum SkyDataManagerColumnPickerSortStrategy {
  /**
   * No sorting is applied to the columns.
   */
  None = 'none',
  /**
   * If `columnPickerEnabled` and `sortEnabled` are set to `true`, then the columns are sorted by the order in which they are displayed, and then alphabetically. Columns that are not displayed are added after the displayed ones.
   * If `sortEnabled` is set to `false`, the columns are displayed in the order specified in `columnOptions`.
   */
  SelectedThenAlphabetical = 'selectedThenAlphabetical',
}

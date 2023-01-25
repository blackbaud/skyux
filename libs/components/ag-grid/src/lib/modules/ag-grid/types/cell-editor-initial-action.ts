/** The initial action that a cell editor should take when initialized. */
export enum SkyAgGridCellEditorInitialAction {
  /** The cell should be cleared. */
  Delete = 0,
  /** The cell value should be highlighted. */
  Highlighted = 1,
  /** The cell value should be replaced with the initializing value. */
  Replace = 2,
  /** The cell should not be modified and the cursor is placed at the end of the value. */
  Untouched = 3,
}

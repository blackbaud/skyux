export enum SkyGridMessageType {
  /**
   * Selects the multiselect checkboxes for all rows in the grid.
   */
  SelectAll = 0,

  /**
   * Clears the multiselect checkboxes for all rows in the grid.
   */
  ClearAll = 1,

  /**
   * @internal
   */
  PromptDeleteRow = 2,

  /**
   * @internal
   */
  AbortDeleteRow = 3,
}

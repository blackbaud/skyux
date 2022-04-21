/**
 * The command for the list view grid to respond to.
 * @deprecated
 */
export enum SkyListViewGridMessageType {
  /**
   * Deletes of a row in the list view grid.
   */
  PromptDeleteRow = 0,

  /**
   * Cancels the deletion of a row in the list view grid.
   */
  AbortDeleteRow = 1,
}

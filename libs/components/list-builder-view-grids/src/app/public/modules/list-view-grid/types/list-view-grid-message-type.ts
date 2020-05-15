/**
 * The command for the list view grid to respond to
 */
export enum SkyListViewGridMessageType {

  /**
   * Triggers a row deletion on the list view grid
   */
  PromptDeleteRow = 0,

  /**
   * Aborts a row deletion on the list view grid
   */
  AbortDeleteRow = 1
}

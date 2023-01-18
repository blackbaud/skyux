/**
 * The result from the selection modal.
 */
export interface SkySelectionModalResult {
  /**
   * Indicates whether the user saved or canceled the modal.
   */
  result: 'save' | 'cancel';

  /**
   * A collection of items the user selected. This property is only
   * set when the `result` property is set to `save`.
   */
  selectedItems?: unknown[];
}

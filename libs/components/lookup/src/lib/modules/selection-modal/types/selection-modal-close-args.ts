/**
 * The result from the selection modal.
 */
export interface SkySelectionModalCloseArgs {
  /**
   * Indicates why the selection modal was closed.
   */
  reason: 'cancel' | 'close' | 'save';

  /**
   * A collection of items the user selected. This property is only
   * set when the `result` property is set to `save`.
   */
  selectedItems?: unknown[];
}

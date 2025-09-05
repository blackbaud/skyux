import { SkySelectionModalCloseReasonType } from './selection-modal-close-reason-type';

/**
 * The result from the selection modal.
 */
export interface SkySelectionModalCloseArgs {
  /**
   * Indicates why the selection modal was closed.
   */
  reason: SkySelectionModalCloseReasonType;

  /**
   * A collection of items the user selected. This property is only
   * set when the `result` property is set to `save`.
   */
  selectedItems?: unknown[];
}

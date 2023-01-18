import { SkySelectionModalAddCallbackArgs } from './selection-modal-add-click-callback-args';

/**
 * Specifies a callback function for the consumer to use to notify the selection modal that a new item has been added.
 */
export interface SkySelectionModalAddClickEventArgs {
  /**
   * A callback function for the consumer to use to notify the selection modal that a new item has been added.
   * @param args Specifies information about the item that was added.
   */
  itemAdded: (args: SkySelectionModalAddCallbackArgs) => void;
}

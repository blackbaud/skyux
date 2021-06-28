import {
  SkyLookupAddCallbackArgs
} from './lookup-add-click-callback-args';

/**
 * Specifies a callback function for the consumer to use to notify the lookup that a new item has been added.
 */
export interface SkyLookupAddClickEventArgs {

  /**
   * A callback function for the consumer to use to notify the lookup that a new item has been added.
   * @param args Specifies information about the item that was added.
   */
  itemAdded: (args: SkyLookupAddCallbackArgs) => void;
}

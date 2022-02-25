import { SkyPopoverMessageType } from './popover-message-type';

/**
 * Specifies messages to be sent to the popover component.
 */
export interface SkyPopoverMessage {
  /**
   * The type of message to send.
   */
  type?: SkyPopoverMessageType;
}

import {
  SkyBackToTopMessageType
} from './back-to-top-message-type';

/**
 * Specifies messages to be sent to the back to top component.
 */
export interface SkyBackToTopMessage {

  /**
   * The type of message to send.
   */
  type?: SkyBackToTopMessageType;
}

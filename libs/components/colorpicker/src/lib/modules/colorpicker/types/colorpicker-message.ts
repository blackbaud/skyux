import { SkyColorpickerMessageType } from './colorpicker-message-type';

/**
 * Commands for the colorpicker through a message stream.
 */
export interface SkyColorpickerMessage {
  /**
   * Specifies the message type.
   */
  type?: SkyColorpickerMessageType;
}

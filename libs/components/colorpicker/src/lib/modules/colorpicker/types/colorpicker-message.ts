import { SkyColorpickerMessageType } from './colorpicker-message-type';

/**
 * Commands for the colorpicker through a message stream.
 */
export interface SkyColorpickerMessage {
  /**
   * The message type.
   */
  type?: SkyColorpickerMessageType;
}

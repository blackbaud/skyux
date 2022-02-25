import { SkyColorpickerMessageType } from './colorpicker-message-type';

/**
 * Provides commands for the colorpicker through a message stream.
 */
export interface SkyColorpickerMessage {
  /**
   * Specifies the message type.
   */
  type?: SkyColorpickerMessageType;
}

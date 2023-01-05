import { SkyColorpickerMessageType } from './colorpicker-message-type';

/**
 * Provides commands for the colorpicker through a message stream.
 */
export interface SkyColorpickerMessage {
  /**
   * The message type.
   */
  type?: SkyColorpickerMessageType;
}

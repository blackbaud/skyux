import { SkyDropdownMessageType } from './dropdown-message-type';

/**
 * Specifies the type of message to send to the dropdown component.
 * @internal
 */
export interface SkyDropdownMessage {
  /**
   * The type of message to send.
   */
  type?: SkyDropdownMessageType;
}

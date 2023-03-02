import { SkyTokensMessageType } from './tokens-message-type';

export interface SkyTokensMessage {
  /**
   * The type of message.
   */
  type?: SkyTokensMessageType;
}

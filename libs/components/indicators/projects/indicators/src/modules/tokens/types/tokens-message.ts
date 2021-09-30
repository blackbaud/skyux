import {
  SkyTokensMessageType
} from './tokens-message-type';

export interface SkyTokensMessage {

  /**
   * Specifies the type of message.
   */
  type?: SkyTokensMessageType;
}

import { SkyGridMessageType } from './grid-message-type';

export interface SkyGridMessage {
  /**
   * The type of message being sent.
   */
  type: SkyGridMessageType;

  /**
   * @internal
   */
  data?: {
    abortDeleteRow?: {
      id: string;
    };
    promptDeleteRow?: {
      id: string;
    };
  };
}

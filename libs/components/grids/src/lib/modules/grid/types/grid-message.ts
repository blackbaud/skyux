import { SkyGridMessageType } from './grid-message-type';

/**
 * @deprecated
 */
export interface SkyGridMessage {
  /**
   * Indicates what type of message is being sent.
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

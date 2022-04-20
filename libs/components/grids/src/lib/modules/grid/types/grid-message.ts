import { SkyGridMessageType } from './grid-message-type';

/**
 * @deprecated `SkyGridComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
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

import { SkyGridLegacyMessageType } from './grid-legacy-message-type';

/**
 * @deprecated `SkyGridLegacyComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
export interface SkyGridLegacyMessage {
  /**
   * The type of message being sent.
   */
  type: SkyGridLegacyMessageType;

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

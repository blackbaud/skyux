import { SkyFlyoutMessageType } from './flyout-message-type';

/**
 * @internal
 */
export interface SkyFlyoutMessage {
  type: SkyFlyoutMessageType;
  data?: {
    ignoreBeforeClose?: boolean;
  };
}

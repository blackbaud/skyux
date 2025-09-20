import { SkyLiveAnnouncerPoliteness } from './live-announcer-politeness';

/**
 * Options used when announcing messages to screen readers via the `SkyLiveAnnouncerService`
 * @internal
 */
export interface SkyLiveAnnouncerArgs {
  politeness?: SkyLiveAnnouncerPoliteness;

  /**
   * Sets how long the live announcer text persists in DOM.
   */
  duration?: number;
}

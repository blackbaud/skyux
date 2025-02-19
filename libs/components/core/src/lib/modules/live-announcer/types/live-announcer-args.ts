import { SkyLiveAnnouncerPoliteness } from './live-announcer-politeness';

/**
 * Options used when announcing messages to screen readers via the `SkyLiveAnnouncerService`
 * @internal
 */
export interface SkyLiveAnnouncerArgs {
  politeness?: SkyLiveAnnouncerPoliteness;
  duration?: number;
}

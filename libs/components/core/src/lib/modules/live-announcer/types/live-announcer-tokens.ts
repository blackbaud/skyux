import { InjectionToken } from '@angular/core';

/** Possible politeness levels. */
export type SkyLiveAnnouncerPoliteness = 'off' | 'polite' | 'assertive';

/** Object that can be used to configure the default options for the SkyLiveAnnouncerService. */
export interface SkyLiveAnnouncerDefaultOptions {
  /** Default politeness for the announcements. */
  politeness?: SkyLiveAnnouncerPoliteness;
}

/** Injection token that can be used to configure the default options for the SkyLiveAnnouncerService. */
export const SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS =
  new InjectionToken<SkyLiveAnnouncerDefaultOptions>(
    'SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS'
  );

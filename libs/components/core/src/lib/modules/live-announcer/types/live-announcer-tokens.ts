import { InjectionToken } from '@angular/core';

/** Possible politeness levels. */
export type SkyAriaLivePoliteness = 'off' | 'polite' | 'assertive';

/** Object that can be used to configure the default options for the SkyLiveAnnouncerService. */
export interface SkyLiveAnnouncerDefaultOptions {
  /** Default politeness for the announcements. */
  politeness?: SkyAriaLivePoliteness;

  /** Default duration for the announcement messages. */
  duration?: number;
}

/** Injection token that can be used to configure the default options for the SkyLiveAnnouncerService. */
export const SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS =
  new InjectionToken<SkyLiveAnnouncerDefaultOptions>(
    'SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS'
  );

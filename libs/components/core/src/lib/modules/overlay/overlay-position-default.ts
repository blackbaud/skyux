import { InjectionToken } from '@angular/core';

import { SkyOverlayPosition } from './overlay-position';

/**
 * Provide a default position strategy for the overlay service.
 *
 * To use this token, provide a value in a host context, inject this token in
 * the consumer, and use the injected value when building an overlay
 * configuration.
 */
export const SkyOverlayPositionDefault = new InjectionToken<
  SkyOverlayPosition | undefined
>('SkyOverlayPositionDefault');

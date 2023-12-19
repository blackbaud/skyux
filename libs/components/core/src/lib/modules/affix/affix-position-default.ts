import { InjectionToken } from '@angular/core';

import { SkyAffixPosition } from './affix-position';

/**
 * Provide a default position strategy for the affix service.
 *
 * To use this token, provide a value in a host context, inject this token in
 * the consumer, and use the injected value when building an affix
 * configuration.
 */
export const SkyAffixPositionDefault = new InjectionToken<
  SkyAffixPosition | undefined
>('SkyAffixPositionDefault');

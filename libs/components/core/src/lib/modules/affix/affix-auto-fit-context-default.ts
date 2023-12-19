import { InjectionToken } from '@angular/core';

import { SkyAffixAutoFitContext } from './affix-auto-fit-context';

/**
 * Provide a default auto-fit context for the affix service.
 *
 * To use this token, provide a value in a host context, inject this token in
 * the consumer, and use the injected value when building an affix
 * configuration.
 */
export const SkyAffixAutoFitContextDefault = new InjectionToken<
  SkyAffixAutoFitContext | undefined
>('SkyAffixAutoFitContextDefault');

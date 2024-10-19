import { InjectionToken } from '@angular/core';

import { SkyBreakpointObserver } from './breakpoint-observer';

/**
 * Used to override a breakpoint observer for specific execution contexts.
 * @internal
 */
export const SKY_BREAKPOINT_OBSERVER =
  new InjectionToken<SkyBreakpointObserver>('SKY_BREAKPOINT_OBSERVER');

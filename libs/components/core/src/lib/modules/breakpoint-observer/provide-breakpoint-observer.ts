import { Provider, Type, inject } from '@angular/core';

import { SkyMediaQueryService } from '../media-query/media-query.service';

import { SkyBreakpointObserver } from './breakpoint-observer';
import { SKY_BREAKPOINT_OBSERVER } from './breakpoint-observer.token';
import { SkyMediaBreakpointObserver } from './media-breakpoint-observer';

/**
 * Overrides the default media breakpoint observer with the given observer.
 * @internal
 */
export function provideSkyBreakpointObserver(
  observer: Type<SkyBreakpointObserver>,
): Provider[] {
  return [
    SkyMediaQueryService,
    observer,
    {
      provide: SkyMediaBreakpointObserver,
      useFactory(): SkyBreakpointObserver {
        return (
          // Yield to the injection token, if it's defined.
          inject(SKY_BREAKPOINT_OBSERVER, { optional: true }) ??
          inject(observer)
        );
      },
    },
  ];
}

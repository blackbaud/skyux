import { Provider } from '@angular/core';
import {
  SKY_BREAKPOINT_OBSERVER,
  SkyContainerBreakpointObserver,
  SkyMediaBreakpointObserver,
  SkyMediaQueryService,
} from '@skyux/core';

import { SkyBreakpointObserverTesting } from './breakpoint-observer-testing';
import { SkyMediaQueryTestingController } from './media-query-testing-controller';

export function provideSkyMediaQueryTesting(): Provider[] {
  return [
    SkyMediaQueryService,
    SkyBreakpointObserverTesting,
    SkyMediaQueryTestingController,
    {
      provide: SkyContainerBreakpointObserver,
      useExisting: SkyBreakpointObserverTesting,
    },
    {
      provide: SkyMediaBreakpointObserver,
      useExisting: SkyBreakpointObserverTesting,
    },
    {
      provide: SKY_BREAKPOINT_OBSERVER,
      useExisting: SkyBreakpointObserverTesting,
    },
  ];
}

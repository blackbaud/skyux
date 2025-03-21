import { Provider } from '@angular/core';
import { SkyHrefResolverService } from '@skyux/router';

import {
  MockUserHasAccess,
  SkyHrefResolverMockService,
} from './href-resolver-mock.service';

/**
 * Provides testing services for the `SkyHref` directive and route resolver.
 * @param options Set whether the user has access to the route.
 */
export function provideHrefTesting(options?: {
  userHasAccess: boolean;
}): Provider[] {
  return [
    SkyHrefResolverMockService,
    {
      provide: SkyHrefResolverService,
      useExisting: SkyHrefResolverMockService,
    },
    {
      provide: MockUserHasAccess,
      useValue: !!options?.userHasAccess,
    },
  ];
}

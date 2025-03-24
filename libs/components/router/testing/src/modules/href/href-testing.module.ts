import { ModuleWithProviders, NgModule } from '@angular/core';
import { SkyHrefModule, SkyHrefResolverService } from '@skyux/router';

import {
  MockUserHasAccess,
  SkyHrefResolverMockService,
} from './href-resolver-mock.service';

/**
 * Testing module for the `SkyHref` directive and route resolver.
 */
@NgModule({
  exports: [SkyHrefModule],
  providers: [
    SkyHrefResolverMockService,
    {
      provide: SkyHrefResolverService,
      useExisting: SkyHrefResolverMockService,
    },
    {
      provide: MockUserHasAccess,
      useValue: true,
    },
  ],
})
export class SkyHrefTestingModule {
  public static with(options: {
    userHasAccess: boolean;
  }): ModuleWithProviders<SkyHrefTestingModule> {
    return {
      ngModule: SkyHrefTestingModule,
      providers: [
        {
          provide: MockUserHasAccess,
          useValue: options.userHasAccess,
        },
      ],
    };
  }
}

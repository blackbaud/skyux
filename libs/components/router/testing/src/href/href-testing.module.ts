import { ModuleWithProviders, NgModule } from '@angular/core';
import { SkyHrefModule, SkyHrefResolverService } from '@skyux/router';

import {
  MockUserHasAccess,
  SkyHrefResolverMockService,
} from './href-resolver-mock.service';

@NgModule({
  imports: [SkyHrefModule],
  providers: [
    SkyHrefResolverMockService,
    {
      provide: SkyHrefResolverService,
      useClass: SkyHrefResolverMockService,
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

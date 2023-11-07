import { NgModule } from '@angular/core';
import { SkyMediaQueryService, SkyUIConfigService } from '@skyux/core';

import { MockSkyMediaQueryService } from './mock-media-query.service';
import { MockSkyUIConfigService } from './mock-ui-config.service';

/**
 * @internal
 */
@NgModule({
  providers: [
    { provide: SkyMediaQueryService, useClass: MockSkyMediaQueryService },
    {
      provide: SkyUIConfigService,
      useClass: MockSkyUIConfigService,
    },
  ],
})
export class SkyCoreTestingModule {}

import { NgModule } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyResizeObserverService } from '@skyux/core';

import { MockSkyResizeObserverService } from './mock-resize-observer.service';

@NgModule({
  providers: [
    {
      provide: SkyResizeObserverService,
      useClass: MockSkyResizeObserverService,
    },
  ],
})
export class SkyResizeObserverTestingModule {}

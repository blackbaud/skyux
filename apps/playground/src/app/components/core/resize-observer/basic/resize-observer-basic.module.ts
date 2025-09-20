import { NgModule } from '@angular/core';
import { SkyResizeObserverMediaQueryService } from '@skyux/core';

import { ResizeObserverBasicComponent } from './resize-observer-basic.component';

@NgModule({
  declarations: [ResizeObserverBasicComponent],
  providers: [SkyResizeObserverMediaQueryService],
})
export class ResizeObserverBasicModule {}

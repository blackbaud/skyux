import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyResizeObserverMediaQueryService } from '@skyux/core';

import { ResizeObserverBasicComponent } from './resize-observer-basic.component';

@NgModule({
  declarations: [ResizeObserverBasicComponent],
  providers: [SkyResizeObserverMediaQueryService],
  imports: [CommonModule],
})
export class ResizeObserverBasicModule {}

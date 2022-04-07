import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';
import { SkySectionedFormModule } from '@skyux/tabs';

import { ResizeObserverContentComponent } from './resize-observer-content.component';
import { ResizeObserverFlyoutComponent } from './resize-observer-flyout.component';

@NgModule({
  declarations: [ResizeObserverFlyoutComponent, ResizeObserverContentComponent],
  imports: [CommonModule, SkyIconModule, SkySectionedFormModule],
  exports: [ResizeObserverFlyoutComponent],
  providers: [
    SkyResizeObserverMediaQueryService,
    {
      provide: SkyMediaQueryService,
      useClass: SkyResizeObserverMediaQueryService,
    },
  ],
})
export class ResizeObserverFlyoutModule {}

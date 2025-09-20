import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { ResizeObserverFlyoutComponent } from './resize-observer-flyout.component';

@NgModule({
  declarations: [ResizeObserverFlyoutComponent],
  imports: [SkyIconModule],
  exports: [ResizeObserverFlyoutComponent],
})
export class ResizeObserverFlyoutModule {}

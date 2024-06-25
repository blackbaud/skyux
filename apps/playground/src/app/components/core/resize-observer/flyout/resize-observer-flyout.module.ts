import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { ResizeObserverFlyoutComponent } from './resize-observer-flyout.component';

@NgModule({
  declarations: [ResizeObserverFlyoutComponent],
  imports: [CommonModule, SkyIconModule],
  exports: [ResizeObserverFlyoutComponent],
})
export class ResizeObserverFlyoutModule {}

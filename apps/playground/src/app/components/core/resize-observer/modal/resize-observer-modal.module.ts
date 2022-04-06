import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';
import { SkySectionedFormModule } from '@skyux/tabs';

import { ResizeObserverBaseComponent } from './resize-observer-base.component';
import { ResizeObserverModalComponent } from './resize-observer-modal.component';

@NgModule({
  declarations: [ResizeObserverBaseComponent, ResizeObserverModalComponent],
  imports: [CommonModule, SkyModalModule, SkySectionedFormModule],
})
export class ResizeObserverModalModule {}

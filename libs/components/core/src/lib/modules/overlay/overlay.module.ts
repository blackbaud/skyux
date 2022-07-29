import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyIdModule } from '../id/id.module';

import { SkyOverlayComponent } from './overlay.component';

@NgModule({
  imports: [CommonModule, SkyIdModule],
  declarations: [SkyOverlayComponent],
})
export class SkyOverlayModule {}

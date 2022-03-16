import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyMediaResourcesModule } from '../shared/sky-media-resources.module';

import { SkyImageComponent } from './image.component';

@NgModule({
  declarations: [SkyImageComponent],
  imports: [CommonModule, SkyMediaResourcesModule],
  exports: [SkyImageComponent],
})
export class SkyImageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyTextExpandRepeaterComponent } from './text-expand-repeater.component';

@NgModule({
  declarations: [SkyTextExpandRepeaterComponent],
  imports: [SkyLayoutResourcesModule, CommonModule],
  exports: [SkyTextExpandRepeaterComponent],
})
export class SkyTextExpandRepeaterModule {}

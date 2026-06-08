import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { _SkyTransitionEndHandlerDirective } from '@skyux/core';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyTextExpandRepeaterComponent } from './text-expand-repeater.component';

@NgModule({
  declarations: [SkyTextExpandRepeaterComponent],
  imports: [
    SkyLayoutResourcesModule,
    CommonModule,
    _SkyTransitionEndHandlerDirective,
  ],
  exports: [SkyTextExpandRepeaterComponent],
})
export class SkyTextExpandRepeaterModule {}

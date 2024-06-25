import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyStatusIndicatorComponent } from './status-indicator.component';

@NgModule({
  declarations: [SkyStatusIndicatorComponent],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
    SkyTrimModule,
  ],
  exports: [SkyStatusIndicatorComponent],
})
export class SkyStatusIndicatorModule {}

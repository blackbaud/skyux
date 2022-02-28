import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyIconModule } from '../icon/icon.module';
import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyStatusIndicatorComponent } from './status-indicator.component';

@NgModule({
  declarations: [SkyStatusIndicatorComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
  ],
  exports: [SkyStatusIndicatorComponent],
})
export class SkyStatusIndicatorModule {}

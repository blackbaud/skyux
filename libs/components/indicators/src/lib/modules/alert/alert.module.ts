import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyIconModule } from '../icon/icon.module';
import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyAlertComponent } from './alert.component';

@NgModule({
  declarations: [SkyAlertComponent],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyAlertComponent],
})
export class SkyAlertModule {}

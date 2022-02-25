import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyI18nModule } from '@skyux/i18n';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyIconModule } from '../icon/icon.module';

import { SkyThemeModule } from '@skyux/theme';

import { SkyAlertComponent } from './alert.component';

@NgModule({
  declarations: [SkyAlertComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyAlertComponent],
})
export class SkyAlertModule {}

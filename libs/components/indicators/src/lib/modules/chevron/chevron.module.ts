import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyThemeModule } from '@skyux/theme';

import { SkyExpansionIndicatorModule } from '../expansion-indicator/expansion-indicator.module';
import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyChevronComponent } from './chevron.component';

@NgModule({
  declarations: [SkyChevronComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
    SkyExpansionIndicatorModule,
  ],
  exports: [SkyChevronComponent],
})
export class SkyChevronModule {}

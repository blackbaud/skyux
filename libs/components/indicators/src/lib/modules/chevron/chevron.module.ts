import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyExpansionIndicatorModule } from '../expansion-indicator/expansion-indicator.module';
import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyChevronComponent } from './chevron.component';

/**
 * @internal
 */
@NgModule({
  declarations: [SkyChevronComponent],
  imports: [
    CommonModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
    SkyExpansionIndicatorModule,
  ],
  exports: [SkyChevronComponent],
})
export class SkyChevronModule {}

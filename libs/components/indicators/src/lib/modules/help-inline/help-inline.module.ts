import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyThemeModule } from '@skyux/theme';

import { SkyIconModule } from '../icon/icon.module';
import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyHelpInlineComponent } from './help-inline.component';

@NgModule({
  declarations: [SkyHelpInlineComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyHelpInlineComponent],
})
export class SkyHelpInlineModule {}

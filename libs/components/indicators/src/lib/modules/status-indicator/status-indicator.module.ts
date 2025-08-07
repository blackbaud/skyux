import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyStatusIndicatorComponent } from './status-indicator.component';

@NgModule({
  declarations: [SkyStatusIndicatorComponent],
  imports: [
    CommonModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
    SkyTrimModule,
  ],
  exports: [SkyStatusIndicatorComponent],
})
export class SkyStatusIndicatorModule {}

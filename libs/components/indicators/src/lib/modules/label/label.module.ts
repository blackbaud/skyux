import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyLabelComponent } from './label.component';

@NgModule({
  declarations: [SkyLabelComponent],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyLabelComponent],
})
export class SkyLabelModule {}

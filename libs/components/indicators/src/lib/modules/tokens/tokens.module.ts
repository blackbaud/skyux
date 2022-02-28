import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyIconModule } from '../icon/icon.module';
import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyTokenComponent } from './token.component';
import { SkyTokensComponent } from './tokens.component';

@NgModule({
  declarations: [SkyTokenComponent, SkyTokensComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
  ],
  exports: [SkyTokenComponent, SkyTokensComponent],
})
export class SkyTokensModule {}

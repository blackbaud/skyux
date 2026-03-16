import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SkyIdModule,
  SkyScreenReaderLabelDirective,
  _SkyAnimationEndHandlerDirective,
} from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyTokenComponent } from './token.component';
import { SkyTokensComponent } from './tokens.component';

@NgModule({
  declarations: [SkyTokenComponent, SkyTokensComponent],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
    SkyIdModule,
    SkyScreenReaderLabelDirective,
    _SkyAnimationEndHandlerDirective,
  ],
  exports: [SkyTokenComponent, SkyTokensComponent],
})
export class SkyTokensModule {}

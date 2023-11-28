import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule, SkyScreenReaderLabelDirective } from '@skyux/core';

import { SkyIconModule } from '../icon/icon.module';
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
  ],
  exports: [SkyTokenComponent, SkyTokensComponent],
})
export class SkyTokensModule {}

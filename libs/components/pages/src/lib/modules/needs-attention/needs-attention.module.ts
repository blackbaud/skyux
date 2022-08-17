import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule, SkyWaitModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { PipesModule } from '../pipes/pipes.module';
import { SkyPagesResourcesModule } from '../shared/sky-pages-resources.module';

import { SkyNeedsAttentionComponent } from './needs-attention.component';

@NgModule({
  declarations: [SkyNeedsAttentionComponent],
  exports: [SkyNeedsAttentionComponent],
  imports: [
    CommonModule,
    SkyAppLinkModule,
    SkyFluidGridModule,
    SkyHrefModule,
    SkyI18nModule,
    SkyIconModule,
    SkyPagesResourcesModule,
    SkyThemeModule,
    SkyTrimModule,
    SkyWaitModule,
    PipesModule,
  ],
})
export class SkyNeedsAttentionModule {}

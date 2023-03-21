import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule, SkyWaitModule } from '@skyux/indicators';
import { SkyBoxModule } from '@skyux/layout';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { LinkAsModule } from '../link-as/link-as.module';
import { SkyPagesResourcesModule } from '../shared/sky-pages-resources.module';

import { SkyNeedsAttentionComponent } from './needs-attention.component';

@NgModule({
  declarations: [SkyNeedsAttentionComponent],
  exports: [SkyNeedsAttentionComponent],
  imports: [
    CommonModule,
    SkyAppLinkModule,
    SkyBoxModule,
    SkyHrefModule,
    SkyI18nModule,
    SkyIconModule,
    SkyPagesResourcesModule,
    SkyThemeModule,
    SkyTrimModule,
    SkyWaitModule,
    LinkAsModule,
  ],
})
export class SkyNeedsAttentionModule {}

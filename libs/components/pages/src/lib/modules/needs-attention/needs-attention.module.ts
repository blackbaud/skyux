import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyBoxModule } from '@skyux/layout';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { LinkAsModule } from '../link-as/link-as.module';
import { SkyPagesResourcesModule } from '../shared/sky-pages-resources.module';

import { SkyNeedsAttentionComponent } from './needs-attention.component';

/**
 * @internal
 */
@NgModule({
  declarations: [SkyNeedsAttentionComponent],
  exports: [SkyNeedsAttentionComponent],
  imports: [
    CommonModule,
    SkyAppLinkModule,
    SkyBoxModule,
    SkyHrefModule,
    SkyIconModule,
    SkyPagesResourcesModule,
    SkyThemeModule,
    SkyTrimModule,
    SkyWaitModule,
    LinkAsModule,
  ],
})
export class SkyNeedsAttentionModule {}

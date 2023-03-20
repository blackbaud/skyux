import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyThemeModule } from '@skyux/theme';

import { SkyLinkListModule } from '../link-list/link-list.module';
import { SkyModalLinkListModule } from '../modal-link-list/modal-link-list.module';
import { SkyNeedsAttentionModule } from '../needs-attention/needs-attention.module';
import { SkyPageHeaderModule } from '../page-header/page-header.module';
import { SkyPagesResourcesModule } from '../shared/sky-pages-resources.module';

import { SkyActionHubButtonsComponent } from './action-hub-buttons.component';
import { SkyActionHubContentComponent } from './action-hub-content.component';
import { SkyActionHubRecentLinksResolvePipe } from './action-hub-recent-links-resolve.pipe';
import { SkyActionHubRelatedLinksSortPipe } from './action-hub-related-links-sort.pipe';
import { SkyActionHubComponent } from './action-hub.component';

@NgModule({
  imports: [
    CommonModule,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyI18nModule,
    SkyLinkListModule,
    SkyModalLinkListModule,
    SkyNeedsAttentionModule,
    SkyPageHeaderModule,
    SkyPagesResourcesModule,
    SkyThemeModule,
    SkyWaitModule,
  ],
  declarations: [
    SkyActionHubButtonsComponent,
    SkyActionHubComponent,
    SkyActionHubContentComponent,
    SkyActionHubRecentLinksResolvePipe,
    SkyActionHubRelatedLinksSortPipe,
  ],
  exports: [
    SkyActionHubButtonsComponent,
    SkyActionHubComponent,
    SkyActionHubContentComponent,
  ],
})
export class SkyActionHubModule {}

import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyThemeModule } from '@skyux/theme';

import { SkyLinkListModule } from '../link-list/link-list.module';
import { SkyModalLinkListModule } from '../modal-link-list/modal-link-list.module';
import { SkyNeedsAttentionModule } from '../needs-attention/needs-attention.module';
import { SkyPageHeaderModule } from '../page-header/page-header.module';
import { SkyPageModule } from '../page/page.module';
import { SkyPagesResourcesModule } from '../shared/sky-pages-resources.module';

import { SkyActionHubButtonsComponent } from './action-hub-buttons.component';
import { SkyActionHubContentComponent } from './action-hub-content.component';
import { SkyActionHubRecentLinksResolvePipe } from './action-hub-recent-links-resolve.pipe';
import { SkyActionHubRelatedLinksSortPipe } from './action-hub-related-links-sort.pipe';
import { SkyActionHubComponent } from './action-hub.component';

@NgModule({
  imports: [
    SkyActionHubRecentLinksResolvePipe,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyLinkListModule,
    SkyModalLinkListModule,
    SkyNeedsAttentionModule,
    SkyPageHeaderModule,
    SkyPagesResourcesModule,
    SkyThemeModule,
    SkyWaitModule,
    SkyPageModule,
  ],
  declarations: [
    SkyActionHubButtonsComponent,
    SkyActionHubComponent,
    SkyActionHubContentComponent,
    SkyActionHubRelatedLinksSortPipe,
  ],
  exports: [
    SkyActionHubButtonsComponent,
    SkyActionHubComponent,
    SkyActionHubContentComponent,
  ],
})
export class SkyActionHubModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyI18nModule } from '@skyux/i18n';
import {
  SkyIconModule,
  SkyKeyInfoModule,
  SkyWaitModule
} from '@skyux/indicators';
import { SkyActionButtonModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyAppLinkModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { SkyLinkListComponent } from '../link-list/link-list.component';
import { SkyNeedsAttentionComponent } from '../needs-attention/needs-attention.component';
import { SkyPageHeaderModule } from '../page-header/page-header.module';
import { SkyPagesResourcesModule } from '../shared/pages-resources.module';

import { SkyActionHubButtonsComponent } from './action-hub-buttons.component';
import { SkyActionHubContentComponent } from './action-hub-content.component';
import { SkyActionHubComponent } from './action-hub.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SkyActionButtonModule,
    SkyAppLinkModule,
    SkyFluidGridModule,
    SkyI18nModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyPageHeaderModule,
    SkyPagesResourcesModule,
    SkyThemeModule,
    SkyWaitModule
  ],
  declarations: [
    SkyActionHubButtonsComponent,
    SkyActionHubComponent,
    SkyActionHubContentComponent,
    SkyNeedsAttentionComponent,
    SkyLinkListComponent
  ],
  exports: [
    SkyActionHubButtonsComponent,
    SkyActionHubComponent,
    SkyActionHubContentComponent
  ]
})
export class SkyActionHubModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyActionHubModule } from '@skyux/pages';

import { ActionHubRoutingModule } from './action-hub-routing.module';
import { ActionHubPlaygroundRecentLinksComponent } from './recent/action-hub-recent-links.component';

@NgModule({
  declarations: [ActionHubPlaygroundRecentLinksComponent],
  imports: [
    CommonModule,
    ActionHubRoutingModule,
    SkyActionHubModule,
    SkyFluidGridModule,
  ],
})
export class ActionHubModule {}

import { NgModule } from '@angular/core';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyActionHubModule } from '@skyux/pages';

import { ActionHubRoutingModule } from './action-hub-routing.module';
import { ActionHubPlaygroundRecentLinksComponent } from './recent/action-hub-recent-links.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [ActionHubPlaygroundRecentLinksComponent, SettingsComponent],
  imports: [
    ActionHubRoutingModule,
    SkyActionHubModule,
    SkyFluidGridModule,
    SkyBoxModule,
  ],
})
export class ActionHubModule {
  public static routes = ActionHubRoutingModule.routes;
}

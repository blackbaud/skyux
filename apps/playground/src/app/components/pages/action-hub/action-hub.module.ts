import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyModalModule } from '@skyux/modals';
import { SkyActionHubModule } from '@skyux/pages';

import { ActionHubRoutingModule } from './action-hub-routing.module';
import { ActionHubPlaygroundRecentLinksComponent } from './recent/action-hub-recent-links.component';
import { SettingsModalComponent } from './settings/modal/settings-modal.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    ActionHubPlaygroundRecentLinksComponent,
    SettingsComponent,
    SettingsModalComponent,
  ],
  imports: [
    CommonModule,
    ActionHubRoutingModule,
    SkyActionHubModule,
    SkyFluidGridModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyBoxModule,
    FormsModule,
  ],
})
export class ActionHubModule {
  public static routes = ActionHubRoutingModule.routes;
}

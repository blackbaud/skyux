import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { SkyPageHeaderActionsComponent } from './page-header-actions.component';
import { SkyPageHeaderAlertsComponent } from './page-header-alerts.component';
import { SkyPageHeaderAvatarComponent } from './page-header-avatar.component';
import { SkyPageHeaderDetailsComponent } from './page-header-details.component';
import { SkyPageHeaderComponent } from './page-header.component';

@NgModule({
  imports: [
    RouterModule,
    SkyAppLinkModule,
    SkyIconModule,
    SkyThemeModule,
    SkyHrefModule,
  ],
  declarations: [
    SkyPageHeaderActionsComponent,
    SkyPageHeaderAlertsComponent,
    SkyPageHeaderAvatarComponent,
    SkyPageHeaderComponent,
    SkyPageHeaderDetailsComponent,
  ],
  exports: [
    SkyPageHeaderActionsComponent,
    SkyPageHeaderAlertsComponent,
    SkyPageHeaderAvatarComponent,
    SkyPageHeaderComponent,
    SkyPageHeaderDetailsComponent,
  ],
})
export class SkyPageHeaderModule {}

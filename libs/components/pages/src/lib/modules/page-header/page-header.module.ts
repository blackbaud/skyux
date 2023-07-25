import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyIconModule } from '@skyux/indicators';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { SkyPageHeaderActionsComponent } from './page-header-actions.component';
import { SkyPageHeaderAvatarComponent } from './page-header-avatar.component';
import { SkyPageHeaderDetailsComponent } from './page-header-details.component';
import { SkyPageHeaderComponent } from './page-header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SkyAppLinkModule,
    SkyIconModule,
    SkyThemeModule,
    SkyHrefModule,
  ],
  declarations: [
    SkyPageHeaderActionsComponent,
    SkyPageHeaderAvatarComponent,
    SkyPageHeaderComponent,
    SkyPageHeaderDetailsComponent,
  ],
  exports: [
    SkyPageHeaderActionsComponent,
    SkyPageHeaderAvatarComponent,
    SkyPageHeaderComponent,
    SkyPageHeaderDetailsComponent,
  ],
})
export class SkyPageHeaderModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyIconModule } from '@skyux/indicators';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { SkyPageHeaderButtonsComponent } from './page-header-buttons.component';
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
    SkyPageHeaderButtonsComponent,
    SkyPageHeaderComponent,
    SkyPageHeaderDetailsComponent,
  ],
  exports: [
    SkyPageHeaderButtonsComponent,
    SkyPageHeaderComponent,
    SkyPageHeaderDetailsComponent,
  ],
})
export class SkyPageHeaderModule {}

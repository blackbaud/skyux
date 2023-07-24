import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyIconModule } from '@skyux/indicators';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

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
  declarations: [SkyPageHeaderComponent, SkyPageHeaderDetailsComponent],
  exports: [SkyPageHeaderComponent, SkyPageHeaderDetailsComponent],
})
export class SkyPageHeaderModule {}

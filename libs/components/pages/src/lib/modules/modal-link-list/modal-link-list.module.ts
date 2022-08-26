import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';

import { SkyModalLinkListComponent } from './modal-link-list.component';

@NgModule({
  declarations: [SkyModalLinkListComponent],
  exports: [SkyModalLinkListComponent],
  imports: [
    CommonModule,
    SkyAppLinkModule,
    SkyHrefModule,
    SkyI18nModule,
    SkyWaitModule,
  ],
})
export class SkyModalLinkListModule {}

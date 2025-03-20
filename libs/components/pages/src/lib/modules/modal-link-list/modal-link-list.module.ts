import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';

import { LinkAsModule } from '../link-as/link-as.module';

import { SkyModalLinkListComponent } from './modal-link-list.component';

@NgModule({
  declarations: [SkyModalLinkListComponent],
  exports: [SkyModalLinkListComponent],
  imports: [
    CommonModule,
    SkyAppLinkModule,
    SkyHrefModule,
    SkyWaitModule,
    LinkAsModule,
  ],
})
export class SkyModalLinkListModule {}

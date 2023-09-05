import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { LinkAsModule } from '../link-as/link-as.module';

import { SkyLinkListComponent } from './link-list.component';

@NgModule({
  declarations: [SkyLinkListComponent],
  exports: [SkyLinkListComponent],
  imports: [
    CommonModule,
    SkyAppLinkModule,
    SkyHrefModule,
    SkyThemeModule,
    SkyWaitModule,
    LinkAsModule,
  ],
})
export class SkyLinkListModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { PipesModule } from '../pipes/pipes.module';

import { SkyLinkListComponent } from './link-list.component';

@NgModule({
  declarations: [SkyLinkListComponent],
  exports: [SkyLinkListComponent],
  imports: [
    CommonModule,
    SkyAppLinkModule,
    SkyHrefModule,
    SkyI18nModule,
    SkyThemeModule,
    SkyWaitModule,
    PipesModule,
  ],
})
export class SkyLinkListModule {}

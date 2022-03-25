import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyDockModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyBackToTopComponent } from './back-to-top.component';
import { SkyBackToTopDirective } from './back-to-top.directive';

@NgModule({
  declarations: [SkyBackToTopComponent, SkyBackToTopDirective],
  imports: [
    CommonModule,
    SkyDockModule,
    SkyI18nModule,
    SkyLayoutResourcesModule,
  ],
  exports: [SkyBackToTopComponent, SkyBackToTopDirective],
  entryComponents: [SkyBackToTopComponent],
})
export class SkyBackToTopModule {}

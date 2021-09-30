import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyDockModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyBackToTopDirective
} from './back-to-top.directive';

import {
  SkyBackToTopComponent
} from './back-to-top.component';
import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

@NgModule({
  declarations: [
    SkyBackToTopComponent,
    SkyBackToTopDirective
  ],
  imports: [
    CommonModule,
    SkyDockModule,
    SkyI18nModule,
    SkyLayoutResourcesModule
  ],
  exports: [
    SkyBackToTopComponent,
    SkyBackToTopDirective
  ],
  entryComponents: [
    SkyBackToTopComponent
  ]
})
export class SkyBackToTopModule { }

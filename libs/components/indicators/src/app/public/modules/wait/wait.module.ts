import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyWaitComponent
} from './wait.component';

import {
  SkyWaitService
} from './wait.service';

import {
  SkyWaitPageAdapterService
} from './wait-page-adapter.service';

import {
  SkyWaitPageComponent
} from './wait-page.component';

@NgModule({
  declarations: [
    SkyWaitComponent,
    SkyWaitPageComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule
  ],
  exports: [
    SkyWaitComponent,
    SkyWaitPageComponent
  ],
  providers: [
    SkyWaitService,
    SkyWaitPageAdapterService,
    SkyWindowRefService
  ],
  entryComponents: [
    SkyWaitPageComponent
  ]
})
export class SkyWaitModule { }

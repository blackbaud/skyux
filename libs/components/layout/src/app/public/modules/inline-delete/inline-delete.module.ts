import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyCoreAdapterService
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyWaitModule
} from '@skyux/indicators';

import {
  SkyLayoutResourcesModule
} from '../shared';

import {
  SkyInlineDeleteComponent
} from './inline-delete.component';

@NgModule({
  declarations: [
    SkyInlineDeleteComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyI18nModule,
    SkyLayoutResourcesModule,
    SkyWaitModule
  ],
  providers: [
    SkyCoreAdapterService
  ],
  exports: [
    SkyInlineDeleteComponent
  ]
})
export class SkyInlineDeleteModule { }

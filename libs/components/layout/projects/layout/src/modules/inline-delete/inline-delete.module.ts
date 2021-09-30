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
  SkyWaitModule
} from '@skyux/indicators';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import {
  SkyInlineDeleteComponent
} from './inline-delete.component';

@NgModule({
  declarations: [
    SkyInlineDeleteComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyLayoutResourcesModule,
    SkyWaitModule
  ],
  exports: [
    SkyInlineDeleteComponent
  ]
})
export class SkyInlineDeleteModule { }

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
  SkyImageComponent
} from './image.component';

import {
  SkyMediaResourcesModule
} from '../shared/media-resources.module';

@NgModule({
  declarations: [
    SkyImageComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyMediaResourcesModule
  ],
  exports: [
    SkyImageComponent
  ]
})
export class SkyImageModule { }

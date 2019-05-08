import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

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
    SkyMediaResourcesModule
  ],
  exports: [
    SkyImageComponent
  ]
})
export class SkyImageModule { }

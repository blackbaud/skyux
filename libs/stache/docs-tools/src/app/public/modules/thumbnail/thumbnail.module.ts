import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyImageModule
} from '@blackbaud/skyux-lib-media';

import {
  SkyDocsThumbnailComponent
} from './thumbnail.component';

@NgModule({
  imports: [
    CommonModule,
    SkyImageModule
  ],
  exports: [
    SkyDocsThumbnailComponent
  ],
  declarations: [
    SkyDocsThumbnailComponent
  ]
})
export class SkyDocsThumbnailModule {}

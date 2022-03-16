import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyVideoComponent
} from './video.component';

@NgModule({
  declarations: [
    SkyVideoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyVideoComponent
  ]
})
export class SkyVideoModule { }

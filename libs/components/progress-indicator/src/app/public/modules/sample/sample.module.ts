import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkySampleComponent
} from './sample.component';

import {
  SkyI18nModule
} from '@skyux/i18n';

@NgModule({
  declarations: [
    SkySampleComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule
  ],
  exports: [
    SkySampleComponent
  ]
})
export class SkySampleModule { }

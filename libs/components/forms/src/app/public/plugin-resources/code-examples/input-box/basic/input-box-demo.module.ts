import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyDatepickerModule
} from '@skyux/datetime';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyThemeModule,
  SkyThemeService
} from '@skyux/theme';

import {
  InputBoxDemoComponent
} from './input-box-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
    SkyThemeModule
  ],
  declarations: [
    InputBoxDemoComponent
  ],
  exports: [
    InputBoxDemoComponent
  ],
  providers: [
    SkyThemeService
  ]
})

export class SkyInputBoxDemoModule {}

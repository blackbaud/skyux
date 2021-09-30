import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyRadioModule
} from 'projects/forms/src/public-api';

import {
  RadioDemoComponent
} from './radio-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyRadioModule
  ],
  declarations: [
    RadioDemoComponent
  ],
  exports: [
    RadioDemoComponent
  ]
})

export class SkyRadioDemoModule {
}

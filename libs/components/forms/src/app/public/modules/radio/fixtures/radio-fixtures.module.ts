// #region imports
import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyRadioModule
} from '../radio.module';

import {
  SkyRadioTestComponent
} from './radio.component.fixture';
import {
  SkyRadioGroupTestComponent
} from './radio-group.component.fixture';
import {
  SkySingleRadioComponent
} from './radio-single.component.fixture';
// #endregion

@NgModule({
  declarations: [
    SkyRadioTestComponent,
    SkyRadioGroupTestComponent,
    SkySingleRadioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyRadioModule
  ],
  exports: [
    SkyRadioTestComponent,
    SkyRadioGroupTestComponent,
    SkySingleRadioComponent
  ]
})
export class SkyRadioFixturesModule { }

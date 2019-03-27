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
  SkyRadioGroupBooleanTestComponent
} from './radio-group-boolean.component.fixture';

import {
  SkyRadioGroupTestComponent
} from './radio-group.component.fixture';
import {
  SkySingleRadioComponent
} from './radio-single.component.fixture';

import {
  SkyRadioOnPushTestComponent
} from './radio-on-push.component.fixture';
// #endregion

@NgModule({
  declarations: [
    SkyRadioTestComponent,
    SkyRadioGroupBooleanTestComponent,
    SkyRadioGroupTestComponent,
    SkyRadioOnPushTestComponent,
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
    SkyRadioGroupBooleanTestComponent,
    SkyRadioGroupTestComponent,
    SkySingleRadioComponent
  ]
})
export class SkyRadioFixturesModule { }

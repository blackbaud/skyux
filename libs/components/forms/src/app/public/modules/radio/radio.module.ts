// #region imports
import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyRadioComponent
} from './radio.component';
import {
  SkyRadioLabelComponent
} from './radio-label.component';
import {
  SkyRadioGroupComponent
} from './radio-group.component';
// #endregion

@NgModule({
  declarations: [
    SkyRadioComponent,
    SkyRadioGroupComponent,
    SkyRadioLabelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyIconModule
  ],
  exports: [
    SkyRadioComponent,
    SkyRadioGroupComponent,
    SkyRadioLabelComponent
  ]
})
export class SkyRadioModule { }

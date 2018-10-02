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
  SkyCheckboxLabelComponent
} from './checkbox-label.component';
import {
  SkyCheckboxComponent
} from './checkbox.component';
// #endregion

@NgModule({
  declarations: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyIconModule
  ],
  exports: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent
  ]
})
export class SkyCheckboxModule { }

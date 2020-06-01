import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyInputBoxComponent
} from './input-box.component';

@NgModule({
  declarations: [
    SkyInputBoxComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyInputBoxComponent
  ]
})
export class SkyInputBoxModule { }

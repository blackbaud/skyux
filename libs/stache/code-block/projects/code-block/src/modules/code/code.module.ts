import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyCodeComponent
} from './code.component';

@NgModule({
  declarations: [
    SkyCodeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyCodeComponent
  ]
})
export class SkyCodeModule { }

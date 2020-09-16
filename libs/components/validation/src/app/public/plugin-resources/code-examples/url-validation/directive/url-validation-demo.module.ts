import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyUrlValidationModule
} from '@skyux/validation';

import {
  UrlValidationDemoComponent
} from './url-validation-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyIdModule,
    SkyUrlValidationModule
  ],
  exports: [
    UrlValidationDemoComponent
  ],
  declarations: [
    UrlValidationDemoComponent
  ]
})
export class UrlValidationDemoModule { }

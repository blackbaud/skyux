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
  SkyEmailValidationModule
} from '@skyux/validation';

import {
  EmailValidationDemoComponent
} from './email-validation-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyEmailValidationModule,
    SkyIdModule
  ],
  exports: [
    EmailValidationDemoComponent
  ],
  declarations: [
    EmailValidationDemoComponent
  ]
})
export class EmailValidationDemoModule { }

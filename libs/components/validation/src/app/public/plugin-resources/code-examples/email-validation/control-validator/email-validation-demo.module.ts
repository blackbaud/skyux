import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
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
    ReactiveFormsModule,
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

import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyStatusIndicatorModule
} from '@skyux/indicators';

import {
  SkyPhoneFieldModule
} from '@skyux/phone-field';

import {
  PhoneFieldDemoComponent
} from './phone-field-demo.component';

@NgModule({
  declarations: [
    PhoneFieldDemoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyPhoneFieldModule,
    SkyStatusIndicatorModule
  ],
  exports: [
    PhoneFieldDemoComponent
  ]
})
export class PhoneFieldDemoModule { }

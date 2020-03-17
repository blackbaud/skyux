import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyCountryFieldModule
} from '@skyux/lookup';

import {
  CountryFieldDemoComponent
} from './country-field-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCountryFieldModule
  ],
  declarations: [
    CountryFieldDemoComponent
  ],
  exports: [
    CountryFieldDemoComponent
  ]
})
export class CountryFieldDemoModule { }

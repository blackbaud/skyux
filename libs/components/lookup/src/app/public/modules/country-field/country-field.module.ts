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
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyAutocompleteModule
} from '../autocomplete';

import {
  SkyLookupResourcesModule
} from '../shared';

import {
  SkyCountryFieldComponent
} from './country-field.component';

@NgModule({
  declarations: [
    SkyCountryFieldComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyI18nModule,
    SkyLookupResourcesModule
  ],
  exports: [
    SkyCountryFieldComponent
  ]
})
export class SkyCountryFieldModule { }

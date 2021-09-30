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
  SkyIdModule
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyAutocompleteModule
} from 'projects/lookup/src/public-api';

import {
  AutocompleteDemoComponent
} from './autocomplete-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIconModule,
    SkyIdModule
  ],
  declarations: [
    AutocompleteDemoComponent
  ],
  exports: [
    AutocompleteDemoComponent
  ]
})
export class AutocompleteDemoModule { }

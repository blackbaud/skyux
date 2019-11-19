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
  SkyDropdownModule
} from '@skyux/popovers';
import {
  SkyIconModule,
  SkyTextHighlightModule
} from '@skyux/indicators';

import {
  SkyAutocompleteComponent
} from './autocomplete.component';
import {
  SkyAutocompleteInputDirective
} from './autocomplete-input.directive';

import {
  SkyLookupResourcesModule
} from '../shared';

@NgModule({
  declarations: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyTextHighlightModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyLookupResourcesModule
  ],
  exports: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective
  ]
})
export class SkyAutocompleteModule { }

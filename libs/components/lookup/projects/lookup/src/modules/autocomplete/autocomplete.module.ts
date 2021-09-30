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
  SkyAffixModule,
  SkyIdModule,
  SkyOverlayModule
} from '@skyux/core';

import {
  SkyIconModule,
  SkyTextHighlightModule
} from '@skyux/indicators';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyLookupResourcesModule
} from '../shared/sky-lookup-resources.module';

import {
  SkyAutocompleteComponent
} from './autocomplete.component';

import {
  SkyAutocompleteInputDirective
} from './autocomplete-input.directive';

@NgModule({
  declarations: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAffixModule,
    SkyTextHighlightModule,
    SkyIconModule,
    SkyIdModule,
    SkyLookupResourcesModule,
    SkyOverlayModule,
    SkyThemeModule
  ],
  exports: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective
  ]
})
export class SkyAutocompleteModule { }

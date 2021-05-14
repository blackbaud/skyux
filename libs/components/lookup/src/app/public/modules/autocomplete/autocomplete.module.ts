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
} from '../shared/lookup-resources.module';

import {
  SkyAutocompleteAdapterService
} from './autocomplete-adapter.service';

import {
  SkyAutocompleteInputDirective
} from './autocomplete-input.directive';

import {
  SkyAutocompleteComponent
} from './autocomplete.component';

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
    SkyLookupResourcesModule,
    SkyThemeModule,
    SkyOverlayModule
  ],
  exports: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective
  ],
  providers: [
    SkyAutocompleteAdapterService
  ]
})
export class SkyAutocompleteModule { }

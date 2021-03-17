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
  SkyThemeService
} from '@skyux/theme';

import {
  SkyAutocompleteModule
} from '../autocomplete.module';

import {
  SkyAutocompleteFixtureComponent
} from './autocomplete.component.fixture';

import {
  SkyAutocompleteReactiveFixtureComponent
} from './autocomplete-reactive.component.fixture';

@NgModule({
  declarations: [
    SkyAutocompleteFixtureComponent,
    SkyAutocompleteReactiveFixtureComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule
  ],
  providers: [
    SkyThemeService
  ],
  exports: [
    SkyAutocompleteFixtureComponent,
    SkyAutocompleteReactiveFixtureComponent
  ]
})
export class SkyAutocompleteFixturesModule { }

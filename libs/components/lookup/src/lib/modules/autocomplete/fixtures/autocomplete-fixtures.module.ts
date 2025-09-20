import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyAutocompleteModule } from '../autocomplete.module';

import { SkyAutocompleteReactiveFixtureComponent } from './autocomplete-reactive.component.fixture';
import { SkyAutocompleteFixtureComponent } from './autocomplete.component.fixture';

@NgModule({
  declarations: [
    SkyAutocompleteFixtureComponent,
    SkyAutocompleteReactiveFixtureComponent,
  ],
  imports: [FormsModule, ReactiveFormsModule, SkyAutocompleteModule],
  exports: [
    SkyAutocompleteFixtureComponent,
    SkyAutocompleteReactiveFixtureComponent,
  ],
})
export class SkyAutocompleteFixturesModule {}

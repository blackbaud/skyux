import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyIdModule } from '@skyux/core';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { AutocompleteHarnessTestComponent } from './autocomplete-harness-test.component';

@NgModule({
  declarations: [AutocompleteHarnessTestComponent],
  imports: [
    FormsModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIdModule,
  ],
})
export class AutocompleteHarnessTestModule {}

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { AutocompleteHarnessTestComponent } from './autocomplete-harness-test.component';

@NgModule({
  declarations: [AutocompleteHarnessTestComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIdModule],
})
export class AutocompleteHarnessTestModule {}

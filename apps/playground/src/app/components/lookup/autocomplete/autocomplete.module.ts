import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { AutocompleteRoutingModule } from './autocomplete-routiing.module';
import { AutocompleteComponent } from './autocomplete.component';

@NgModule({
  declarations: [AutocompleteComponent],
  imports: [
    AutocompleteRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyInputBoxModule,
  ],
})
export class AutocompleteModule {}

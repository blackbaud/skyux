import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { AutocompleteRoutingModule } from './autocomplete-routing.module';
import { AutocompleteComponent } from './autocomplete.component';

@NgModule({
  declarations: [AutocompleteComponent],
  imports: [
    AutocompleteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyInputBoxModule,
  ],
})
export class AutocompleteModule {
  public static routes = AutocompleteRoutingModule.routes;
}

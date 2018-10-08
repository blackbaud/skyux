import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SkyAutocompleteModule } from '../autocomplete.module';
import { SkyAutocompleteTestComponent } from './autocomplete.component.fixture';

@NgModule({
  declarations: [
    SkyAutocompleteTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAutocompleteModule
  ],
  exports: [
    SkyAutocompleteTestComponent
  ]
})
export class SkyAutocompleteFixturesModule { }

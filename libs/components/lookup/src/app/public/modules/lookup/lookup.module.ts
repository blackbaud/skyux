import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  SkyAppWindowRef
} from '@skyux/core';

import { SkyAutocompleteModule } from '../autocomplete/autocomplete.module';
import { SkyTokensModule } from '@skyux/indicators';

import { SkyLookupComponent } from './lookup.component';

@NgModule({
  declarations: [
    SkyLookupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAutocompleteModule,
    SkyTokensModule
  ],
  exports: [
    SkyLookupComponent
  ],
  providers: [
    SkyAppWindowRef
  ]
})
export class SkyLookupModule { }

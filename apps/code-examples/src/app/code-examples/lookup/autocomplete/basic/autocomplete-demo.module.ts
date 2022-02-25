import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyAutocompleteModule } from '@skyux/lookup';

import { AutocompleteDemoComponent } from './autocomplete-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIdModule,
  ],
  declarations: [AutocompleteDemoComponent],
  exports: [AutocompleteDemoComponent],
})
export class AutocompleteDemoModule {}

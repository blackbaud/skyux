import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkyAutocompleteModule } from '../autocomplete/autocomplete.module';
import { SkyLookupResourcesModule } from '../shared/sky-lookup-resources.module';

import { SkyCountryFieldComponent } from './country-field.component';

@NgModule({
  declarations: [SkyCountryFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIconModule,
    SkyLookupResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyCountryFieldComponent],
})
export class SkyCountryFieldModule {}

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyInputBoxModule } from '@skyux/forms';

import { SkyCountryFieldModule } from 'projects/lookup/src/public-api';

import { CountryFieldDemoComponent } from './country-field-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
  ],
  declarations: [CountryFieldDemoComponent],
  exports: [CountryFieldDemoComponent],
})
export class CountryFieldDemoModule {}

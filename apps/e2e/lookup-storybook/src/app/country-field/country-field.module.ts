import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyCountryFieldModule } from '@skyux/lookup';

import { CountryFieldComponent } from './country-field.component';

const routes: Routes = [{ path: '', component: CountryFieldComponent }];
@NgModule({
  declarations: [CountryFieldComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyCountryFieldModule,
    SkyInputBoxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [CountryFieldComponent],
})
export class CountryFieldModule {}

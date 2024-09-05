import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyCountryFieldModule } from '@skyux/lookup';

import { CountryFieldRoutingModule } from './country-field-routing.module';
import { CountryFieldComponent } from './country-field.component';

@NgModule({
  declarations: [CountryFieldComponent],
  imports: [
    CountryFieldRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
    RouterModule,
  ],
})
export class CountryFieldModule {
  public static routes = CountryFieldRoutingModule.routes;
}

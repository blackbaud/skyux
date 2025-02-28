import { Component } from '@angular/core';
import { SKY_COUNTRY_FIELD_CONTEXT } from '@skyux/lookup';

@Component({
  selector: 'app-country-field-mock-phone-field',
  template: '<ng-content/>',
  providers: [
    {
      provide: SKY_COUNTRY_FIELD_CONTEXT,
      useValue: { inPhoneField: true },
    },
  ],
})
export class CountryFieldMockPhoneFieldComponent {}

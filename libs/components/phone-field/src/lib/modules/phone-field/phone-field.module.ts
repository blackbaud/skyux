import { NgModule } from '@angular/core';

import { SkyPhoneFieldInputDirective } from './phone-field-input.directive';
import { SkyPhoneFieldComponent } from './phone-field.component';

/**
 * @docsIncludeIds SkyPhoneFieldComponent, SkyPhoneFieldInputDirective, SkyPhoneFieldCountry, SkyPhoneFieldNumberReturnFormat, SkyPhoneFieldHarness, SkyPhoneFieldHarnessFilters, PhoneFieldBasicExampleComponent
 */
@NgModule({
  imports: [SkyPhoneFieldComponent, SkyPhoneFieldInputDirective],
  exports: [SkyPhoneFieldComponent, SkyPhoneFieldInputDirective],
})
export class SkyPhoneFieldModule {}

import { NgModule } from '@angular/core';

import { SkyPhoneFieldInputDirective } from './phone-field-input.directive';
import { SkyPhoneFieldComponent } from './phone-field.component';

@NgModule({
  imports: [SkyPhoneFieldComponent, SkyPhoneFieldInputDirective],
  exports: [SkyPhoneFieldComponent, SkyPhoneFieldInputDirective],
})
export class SkyPhoneFieldModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyPhoneFieldModule } from '@skyux/phone-field';

import { PhoneFieldRoutingModule } from './phone-field-routing.module';
import { PhoneFieldComponent } from './phone-field.component';

@NgModule({
  declarations: [PhoneFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PhoneFieldRoutingModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyPhoneFieldModule,
  ],
})
export class PhoneFieldModule {}

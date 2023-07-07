import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyPhoneFieldModule } from '@skyux/phone-field';

import { PhoneFieldComponent } from './phone-field.component';

const routes: Routes = [{ path: '', component: PhoneFieldComponent }];
@NgModule({
  declarations: [PhoneFieldComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyPhoneFieldModule,
  ],
  exports: [PhoneFieldComponent],
})
export class PhoneFieldModule {}

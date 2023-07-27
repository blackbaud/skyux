import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyEmailValidationModule } from '@skyux/validation';

import { EmailValidationDemoComponent } from './email-validation-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyEmailValidationModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
  exports: [EmailValidationDemoComponent],
  declarations: [EmailValidationDemoComponent],
})
export class EmailValidationDemoModule {}

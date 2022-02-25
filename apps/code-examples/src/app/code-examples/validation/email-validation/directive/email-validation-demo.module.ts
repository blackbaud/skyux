import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyInputBoxModule } from '@skyux/forms';

import { SkyEmailValidationModule } from 'projects/validation/src/public-api';

import { EmailValidationDemoComponent } from './email-validation-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyEmailValidationModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
  exports: [EmailValidationDemoComponent],
  declarations: [EmailValidationDemoComponent],
})
export class EmailValidationDemoModule {}

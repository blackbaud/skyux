import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyEmailValidationModule } from '../email-validation.module';

import { EmailValidationTestComponent } from './email-validation.component.fixture';

@NgModule({
  declarations: [EmailValidationTestComponent],
  imports: [FormsModule, CommonModule, SkyEmailValidationModule],
  exports: [EmailValidationTestComponent],
})
export class SkyEmailValidationFixturesModule {}

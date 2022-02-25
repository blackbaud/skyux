import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { SkyIconModule } from '@skyux/indicators';

import { SkyCheckboxComponent } from './checkbox.component';

import { SkyCheckboxLabelComponent } from './checkbox-label.component';

import { SkyCheckboxRequiredValidatorDirective } from './checkbox-required-validator.directive';

@NgModule({
  declarations: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyCheckboxRequiredValidatorDirective,
  ],
  imports: [CommonModule, FormsModule, SkyIconModule],
  exports: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyCheckboxRequiredValidatorDirective,
  ],
})
export class SkyCheckboxModule {}

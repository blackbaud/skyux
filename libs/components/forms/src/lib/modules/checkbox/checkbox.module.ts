import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIconModule } from '@skyux/indicators';

import { SkyCheckboxLabelComponent } from './checkbox-label.component';
import { SkyCheckboxRequiredValidatorDirective } from './checkbox-required-validator.directive';
import { SkyCheckboxComponent } from './checkbox.component';

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

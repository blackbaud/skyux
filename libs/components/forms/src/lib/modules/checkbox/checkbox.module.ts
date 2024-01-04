import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';

import { SkyFormErrorsModule } from '../form-error/form-errors.module';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyCheckboxLabelComponent } from './checkbox-label.component';
import { SkyCheckboxRequiredValidatorDirective } from './checkbox-required-validator.directive';
import { SkyCheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyCheckboxRequiredValidatorDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyFormErrorsModule,
    SkyFormsResourcesModule,
    SkyIconModule,
    SkyTrimModule,
  ],
  exports: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyCheckboxRequiredValidatorDirective,
  ],
})
export class SkyCheckboxModule {}

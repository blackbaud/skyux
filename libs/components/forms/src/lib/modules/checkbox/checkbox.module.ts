import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';

import { SkyFormErrorComponent } from '../form-error/form-error.component';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyCheckboxLabelComponent } from './checkbox-label.component';
import { SkyCheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [SkyCheckboxComponent, SkyCheckboxLabelComponent],
  imports: [
    CommonModule,
    FormsModule,
    SkyFormErrorComponent,
    SkyFormErrorsModule,
    SkyFormsResourcesModule,
    SkyIconModule,
    SkyTrimModule,
  ],
  exports: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyFormErrorComponent,
  ],
})
export class SkyCheckboxModule {}

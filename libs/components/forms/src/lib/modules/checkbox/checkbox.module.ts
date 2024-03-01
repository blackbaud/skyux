import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';

import { SkyFormErrorModule } from '../form-error/form-error.module';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyCheckboxLabelTextLabelComponent } from './checkbox-label-text-label.component';
import { SkyCheckboxLabelComponent } from './checkbox-label.component';
import { SkyCheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyCheckboxLabelTextLabelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyFormErrorModule,
    SkyFormErrorsModule,
    SkyFormsResourcesModule,
    SkyIconModule,
    SkyTrimModule,
  ],
  exports: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyFormErrorModule,
  ],
})
export class SkyCheckboxModule {}

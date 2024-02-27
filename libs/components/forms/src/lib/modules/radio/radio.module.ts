import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';

import { SkyFormErrorModule } from '../form-error/form-error.module';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyRadioGroupComponent } from './radio-group.component';
import { SkyRadioLabelComponent } from './radio-label.component';
import { SkyRadioComponent } from './radio.component';

@NgModule({
  declarations: [
    SkyRadioComponent,
    SkyRadioGroupComponent,
    SkyRadioLabelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyFormErrorModule,
    SkyFormErrorsModule,
    SkyIconModule,
    SkyIdModule,
    SkyFormsResourcesModule,
    SkyTrimModule,
  ],
  exports: [
    SkyFormErrorModule,
    SkyRadioComponent,
    SkyRadioGroupComponent,
    SkyRadioLabelComponent,
  ],
})
export class SkyRadioModule {}

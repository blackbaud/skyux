import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyEmailValidationModule } from '@skyux/validation';

import { InputBoxDemoComponent } from './input-box-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyBoxModule,
    SkyDatepickerModule,
    SkyEmailValidationModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
  declarations: [InputBoxDemoComponent],
  exports: [InputBoxDemoComponent],
})
export class InputBoxDemoModule {}

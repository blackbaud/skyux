import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPopoverModule } from '@skyux/popovers';
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
    SkyHelpInlineModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyPopoverModule,
  ],
  declarations: [InputBoxDemoComponent],
  exports: [InputBoxDemoComponent],
})
export class InputBoxDemoModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';

import { CheckboxDemoComponent } from './checkbox-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyHelpInlineModule,
  ],
  declarations: [CheckboxDemoComponent],
  exports: [CheckboxDemoComponent],
})
export class CheckboxDemoModule {}

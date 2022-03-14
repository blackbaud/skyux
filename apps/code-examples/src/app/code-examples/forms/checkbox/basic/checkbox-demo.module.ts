import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

import { CheckboxDemoComponent } from './checkbox-demo.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkyCheckboxModule],
  declarations: [CheckboxDemoComponent],
  exports: [CheckboxDemoComponent],
})
export class CheckboxDemoModule {}

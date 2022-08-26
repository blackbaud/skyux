import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

import { CheckboxHarnessTestComponent } from './checkbox-harness-test.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkyCheckboxModule],
  declarations: [CheckboxHarnessTestComponent],
})
export class CheckboxHarnessTestModule {}

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyCheckboxModule } from '@skyux/forms';

import { CheckboxHarnessTestComponent } from './checkbox-harness-test.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    NoopAnimationsModule,
  ],
  declarations: [CheckboxHarnessTestComponent],
})
export class CheckboxHarnessTestModule {}

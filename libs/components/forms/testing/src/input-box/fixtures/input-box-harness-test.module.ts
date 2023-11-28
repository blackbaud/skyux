import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { InputBoxHarnessTestComponent } from './input-box-harness-test.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
  declarations: [InputBoxHarnessTestComponent],
})
export class InputBoxHarnessTestModule {}

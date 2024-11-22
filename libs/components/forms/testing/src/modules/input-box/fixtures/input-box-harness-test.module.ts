import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyDatepickerModule, SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyPhoneFieldModule } from '@skyux/phone-field';

import { InputBoxHarnessTestComponent } from './input-box-harness-test.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
    SkyDatepickerModule,
    SkyTimepickerModule,
    SkyPhoneFieldModule,
  ],
  declarations: [InputBoxHarnessTestComponent],
})
export class InputBoxHarnessTestModule {}

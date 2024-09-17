import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyRadioModule } from '@skyux/forms';

import { RadioHarnessTestComponent } from './radio-harness-test.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyRadioModule,
    NoopAnimationsModule,
  ],
  declarations: [RadioHarnessTestComponent],
})
export class RadioHarnessTestModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { TimepickerDemoComponent } from './timepicker-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
    SkyTimepickerModule,
  ],
  exports: [TimepickerDemoComponent],
  declarations: [TimepickerDemoComponent],
})
export class TimepickerDemoModule {}

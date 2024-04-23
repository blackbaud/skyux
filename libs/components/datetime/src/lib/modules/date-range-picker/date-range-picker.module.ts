import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyDatepickerModule } from '../datepicker/datepicker.module';
import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDateRangePickerEndDateResourceKeyPipe } from './date-range-picker-end-date-resource-key.pipe';
import { SkyDateRangePickerStartDateResourceKeyPipe } from './date-range-picker-start-date-resource-key.pipe';
import { SkyDateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  declarations: [
    SkyDateRangePickerComponent,
    SkyDateRangePickerEndDateResourceKeyPipe,
    SkyDateRangePickerStartDateResourceKeyPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyDatetimeResourcesModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyHelpInlineModule,
  ],
  exports: [SkyDateRangePickerComponent],
})
export class SkyDateRangePickerModule {}

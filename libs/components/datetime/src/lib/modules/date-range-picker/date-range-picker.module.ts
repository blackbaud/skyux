import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyDatepickerModule } from '../datepicker/datepicker.module';
import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDateRangePickerComponent } from './date-range-picker.component';
import { SkyDateRangeService } from './date-range.service';

@NgModule({
  declarations: [SkyDateRangePickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyI18nModule,
    SkyDatepickerModule,
    SkyDatetimeResourcesModule,
    SkyInputBoxModule,
  ],
  exports: [SkyDateRangePickerComponent],
  providers: [SkyDateRangeService],
})
export class SkyDateRangePickerModule {}

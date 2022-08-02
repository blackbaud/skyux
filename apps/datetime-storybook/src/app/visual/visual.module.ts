import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import {
  SkyDatePipeModule,
  SkyDateRangePickerModule,
  SkyDatepickerModule,
  SkyTimepickerModule,
} from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { DatePipeVisualComponent } from './date-pipe/date-pipe-visual.component';
import { DatePipeWithProviderVisualComponent } from './date-pipe/date-pipe-with-provider-visual.component';
import { DateRangePickerVisualComponent } from './date-range-picker/date-range-picker-visual.component';
import { DatepickerVisualComponent } from './datepicker/datepicker-visual.component';
import { FuzzyDatePipeVisualComponent } from './fuzzy-date-pipe/fuzzy-date-pipe-visual.component';
import { FuzzyDatepickerVisualComponent } from './fuzzy-datepicker/fuzzy-datepicker-visual.component';
import { TimepickerVisualComponent } from './timepicker/timepicker-visual.component';
import { VisualComponent } from './visual.component';

@NgModule({
  declarations: [
    DatePipeVisualComponent,
    DatePipeWithProviderVisualComponent,
    DateRangePickerVisualComponent,
    DatepickerVisualComponent,
    FuzzyDatePipeVisualComponent,
    FuzzyDatepickerVisualComponent,
    TimepickerVisualComponent,
    VisualComponent,
  ],
  imports: [
    NoopAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyTimepickerModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyDateRangePickerModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyTimepickerModule,
    RouterModule,
  ],
  exports: [
    DatePipeVisualComponent,
    DatePipeWithProviderVisualComponent,
    DateRangePickerVisualComponent,
    DatepickerVisualComponent,
    FuzzyDatePipeVisualComponent,
    FuzzyDatepickerVisualComponent,
    TimepickerVisualComponent,
    VisualComponent,
  ],
})
export class VisualModule {}

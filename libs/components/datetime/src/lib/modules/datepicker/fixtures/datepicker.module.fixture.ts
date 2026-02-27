import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyThemeModule } from '@skyux/theme';

import { SkyDatepickerModule } from '../datepicker.module';

import { DatepickerCalendarTestComponent } from './datepicker-calendar.component.fixture';
import { DatepickerInputBoxTestComponent } from './datepicker-input-box.component.fixture';
import { DatepickerNoFormatTestComponent } from './datepicker-no-format.component.fixture';
import { DatepickerReactiveTestComponent } from './datepicker-reactive.component.fixture';
import { DatepickerTestComponent } from './datepicker.component.fixture';

@NgModule({
  declarations: [
    DatepickerCalendarTestComponent,
    DatepickerInputBoxTestComponent,
    DatepickerNoFormatTestComponent,
    DatepickerReactiveTestComponent,
    DatepickerTestComponent],
  imports: [
    SkyDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyThemeModule],
  exports: [
    DatepickerCalendarTestComponent,
    DatepickerInputBoxTestComponent,
    DatepickerNoFormatTestComponent,
    DatepickerReactiveTestComponent,
    DatepickerTestComponent],
})
export class DatepickerTestModule {}

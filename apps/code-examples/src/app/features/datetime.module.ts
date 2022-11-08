import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatePipeDemoComponent } from '../code-examples/datetime/date-pipe/basic/date-pipe-demo.component';
import { DatePipeDemoModule } from '../code-examples/datetime/date-pipe/basic/date-pipe-demo.module';
import { DateRangePickerDemoComponent } from '../code-examples/datetime/date-range-picker/basic/date-range-picker-demo.component';
import { DateRangePickerDemoModule } from '../code-examples/datetime/date-range-picker/basic/date-range-picker-demo.module';
import { DatepickerDemoComponent as DatepickerBasicDemoComponent } from '../code-examples/datetime/datepicker/basic/datepicker-demo.component';
import { DatepickerDemoModule as DatepickerBasicDemoModule } from '../code-examples/datetime/datepicker/basic/datepicker-demo.module';
import { DatepickerDemoComponent as DatepickerCustomDemoComponent } from '../code-examples/datetime/datepicker/custom-dates/datepicker-demo.component';
import { DatepickerDemoModule as DatepickerCustomDemoModule } from '../code-examples/datetime/datepicker/custom-dates/datepicker-demo.module';
import { DatepickerDemoComponent as DatepickerFuzzyDemoComponent } from '../code-examples/datetime/datepicker/fuzzy/datepicker-demo.component';
import { DatepickerDemoModule as DatepickerFuzzyDemoModule } from '../code-examples/datetime/datepicker/fuzzy/datepicker-demo.module';
import { TimepickerDemoComponent } from '../code-examples/datetime/timepicker/basic/timepicker-demo.component';
import { TimepickerDemoModule } from '../code-examples/datetime/timepicker/basic/timepicker-demo.module';

const routes: Routes = [
  {
    path: 'date-pipe/basic',
    component: DatePipeDemoComponent,
  },
  {
    path: 'date-range-picker/basic',
    component: DateRangePickerDemoComponent,
  },
  {
    path: 'datepicker/basic',
    component: DatepickerBasicDemoComponent,
  },
  {
    path: 'datepicker/custom-dates',
    component: DatepickerCustomDemoComponent,
  },
  {
    path: 'datepicker/fuzzy',
    component: DatepickerFuzzyDemoComponent,
  },
  {
    path: 'timepicker/basic',
    component: TimepickerDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatetimeFeatureRoutingModule {}

@NgModule({
  imports: [
    DatetimeFeatureRoutingModule,
    DatepickerBasicDemoModule,
    DatePipeDemoModule,
    DateRangePickerDemoModule,
    DatepickerCustomDemoModule,
    DatepickerFuzzyDemoModule,
    TimepickerDemoModule,
  ],
})
export class DatetimeFeatureModule {}

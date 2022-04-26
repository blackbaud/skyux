import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatepickerDemoComponent as DatepickerBasicDemoComponent } from '../code-examples/datetime/datepicker/basic/datepicker-demo.component';
import { DatepickerDemoModule as DatepickerBasicDemoModule } from '../code-examples/datetime/datepicker/basic/datepicker-demo.module';

const routes: Routes = [
  {
    path: 'datepicker/basic',
    component: DatepickerBasicDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatetimeFeatureRoutingModule {}

@NgModule({
  imports: [DatetimeFeatureRoutingModule, DatepickerBasicDemoModule],
})
export class DatetimeFeatureModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'date-range-picker',
    loadChildren: () =>
      import('./date-range-picker/date-range-picker.module').then(
        (m) => m.DateRangePickerModule
      ),
  },
  {
    path: 'datepicker',
    loadChildren: () =>
      import('./datepicker/datepicker.module').then((m) => m.DatepickerModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatetimeRoutingModule {}

@NgModule({
  imports: [DatetimeRoutingModule],
})
export class DatetimeModule {}

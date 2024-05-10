import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'date-pipe',
    loadChildren: () =>
      import('./date-pipe/date-pipe.module').then((m) => m.DatePipeModule),
  },
  {
    path: 'date-range-picker',
    loadChildren: () =>
      import('./date-range-picker/date-range-picker.module').then(
        (m) => m.DateRangePickerModule,
      ),
  },
  {
    path: 'date-range-picker-2',
    loadChildren: () =>
      import('./date-range-picker-2/date-range-picker.module').then(
        (m) => m.DateRangePickerModule,
      ),
  },
  {
    path: 'datepicker',
    loadChildren: () =>
      import('./datepicker/datepicker.module').then((m) => m.DatepickerModule),
  },
  {
    path: 'timepicker',
    loadChildren: () => import('./timepicker/routes'),
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
export class DatetimeModule {
  public static routes = routes;
}

import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'datepicker',
    loadChildren: () =>
      import('./datepicker/datepicker.module').then((m) => m.DatepickerModule),
  },
  {
    path: 'date-range-picker',
    loadChildren: () =>
      import('./date-range-picker/date-range-picker.module').then(
        (m) => m.DateRangePickerModule,
      ),
  },
  {
    path: 'timepicker',
    loadChildren: () =>
      import('./timepicker/timepicker.module').then((m) => m.TimepickerModule),
  },
];

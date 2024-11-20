import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'date-pipe/basic',
    loadComponent: () =>
      import('../code-examples/datetime/date-pipe/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'date-range-picker/basic',
    loadComponent: () =>
      import(
        '../code-examples/datetime/date-range-picker/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'date-range-picker/custom-calculator',
    loadComponent: () =>
      import(
        '../code-examples/datetime/date-range-picker/custom-calculator/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'date-range-picker/help-key',
    loadComponent: () =>
      import(
        '../code-examples/datetime/date-range-picker/help-key/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'datepicker/basic',
    loadComponent: () =>
      import('../code-examples/datetime/datepicker/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'datepicker/custom-dates',
    loadComponent: () =>
      import(
        '../code-examples/datetime/datepicker/custom-dates/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'datepicker/fuzzy',
    loadComponent: () =>
      import('../code-examples/datetime/datepicker/fuzzy/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'timepicker/basic',
    loadComponent: () =>
      import('../code-examples/datetime/timepicker/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DatetimeFeatureModule {}

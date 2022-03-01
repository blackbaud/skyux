import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'components/datepicker',
    loadChildren: () =>
      import('./components/datetime/datepicker/datepicker.module').then(
        (m) => m.DatepickerModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

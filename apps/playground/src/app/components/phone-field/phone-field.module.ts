import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'phone-field',
    loadChildren: () =>
      import('./phone-field/phone-field.module').then(
        (m) => m.PhoneFieldModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhoneFieldRoutingModule {}

@NgModule({
  imports: [PhoneFieldRoutingModule],
})
export class PhoneFieldModule {}

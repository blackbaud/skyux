import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'flyout',
    loadChildren: () =>
      import('./flyout/flyout.module').then((m) => m.FlyoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlyoutRoutingModule {}

@NgModule({
  imports: [FlyoutRoutingModule],
})
export class FlyoutModule {}

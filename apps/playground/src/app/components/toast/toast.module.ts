import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'toast',
    loadChildren: () =>
      import('./toast/toast.module').then((m) => m.ToastModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToastRoutingMoudle {}

@NgModule({
  imports: [ToastRoutingMoudle],
})
export class ToastModule {
  public static routes = routes;
}

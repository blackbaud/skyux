import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dropdown',
    loadChildren: () =>
      import('./dropdown/dropdown.module').then((m) => m.DropdownModule),
  },
  {
    path: 'popovers',
    loadChildren: () =>
      import('./popovers/popovers.module').then((m) => m.PopoversModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoversRoutingModule {}

@NgModule({
  imports: [PopoversRoutingModule],
})
export class PopoversModule {
  public static routes = routes;
}

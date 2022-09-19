import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'action-button',
    loadChildren: () =>
      import('./action-button/action-button.module').then(
        (m) => m.ActionButtonModule
      ),
  },
  {
    path: 'back-to-top',
    loadChildren: () =>
      import('./back-to-top/back-to-top.module').then((m) => m.BackToTopModule),
  },
  {
    path: 'box',
    loadChildren: () => import('./box/box.module').then((m) => m.BoxModule),
  },
  {
    path: 'description-list',
    loadChildren: () =>
      import('./description-list/description-list.module').then(
        (m) => m.DescriptionListModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}

@NgModule({
  imports: [LayoutRoutingModule],
})
export class LayoutModule {
  public static routes = routes;
}

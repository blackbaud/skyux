import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'action-hub',
    loadChildren: () =>
      import('./action-hub/action-hub.module').then((m) => m.ActionHubModule),
  },
  {
    path: 'layouts',
    loadChildren: () => import('./layouts/routes'),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
  public static routes = routes;
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tile-dashboard',
    loadChildren: () =>
      import('./tile-dashboard/tile-dashboard.module').then(
        (m) => m.TileDashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TilesRoutingModule {}

@NgModule({
  imports: [TilesRoutingModule],
})
export class TilesModule {
  public static routes = routes;
}

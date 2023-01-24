import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TileDashboardComponent } from './tile-dashboard/tile-dashboard.component';
import { TileDashboardModule } from './tile-dashboard/tile-dashboard.module';

const routes: Routes = [
  {
    path: 'tile-dashboard',
    component: TileDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TilesRoutingModule {}

@NgModule({
  imports: [TilesRoutingModule, TileDashboardModule],
})
export class TilesModule {
  public static routes = routes;
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'filter-bar',
    loadChildren: () =>
      import('./filter-bar/filter-bar.module').then((m) => m.FilterBarModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterBarRoutingModule {
  public static routes = routes;
}

@NgModule({
  imports: [FilterBarRoutingModule],
})
export class FilterBarModule {
  public static routes = FilterBarRoutingModule.routes;
}

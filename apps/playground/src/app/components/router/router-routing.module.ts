import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'skyHref',
    loadComponent: () =>
      import('./skyHref/skyHref.component').then((m) => m.SkyHrefComponent),
    data: {
      name: 'SkyHref',
      icon: 'link',
      library: 'router',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RouterRoutingModule {
  public static routes = routes;
}

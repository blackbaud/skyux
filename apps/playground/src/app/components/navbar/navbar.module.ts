import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'navbar',
    loadChildren: () =>
      import('./navbar/navbar.module').then((m) => m.NavbarModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavbarRoutingModule {
  public static routes = routes;
}

@NgModule({
  imports: [NavbarRoutingModule],
})
export class NavbarModule {
  public static routes = NavbarRoutingModule.routes;
}

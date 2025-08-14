import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'buttons',
    loadChildren: () =>
      import('./buttons/buttons.module').then((m) => m.ButtonsModule),
  },
  {
    path: 'viewport-service',
    loadComponent: () =>
      import('./viewport-service/viewport-service.component'),
    data: {
      name: 'Viewport Service',
      icon: 'grid',
      library: 'theme',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeRoutingModule {}

@NgModule({
  imports: [ThemeRoutingModule],
})
export class ThemeModule {
  public static routes = routes;
}

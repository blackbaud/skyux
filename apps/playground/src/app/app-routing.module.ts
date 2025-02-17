import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'components',
    loadChildren: () =>
      import('./components/components.module').then((m) => m.ComponentsModule),
  },
  {
    path: 'simple-grid/drop-in',
    loadComponent: () =>
      import('./components/_simple-grid/example-drop-in.component'),
  },
  {
    path: 'simple-grid/new',
    loadComponent: () =>
      import('./components/_simple-grid/example-simple-grid.component'),
  },
  {
    path: 'simple-grid/list-builder',
    loadComponent: () =>
      import('./components/_simple-grid/example-list-builder.component'),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

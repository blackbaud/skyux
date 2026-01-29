import { Routes } from '@angular/router';
import { routes as CodeExampleRoutes } from '@skyux/code-examples/routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    pathMatch: 'full',
  },
  {
    path: 'examples',
    children: CodeExampleRoutes,
  },
];

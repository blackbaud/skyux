import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'code',
    loadComponent: () => import('./code/code-playground'),
    data: {
      name: 'Code',
      icon: 'code',
      library: 'code',
    },
  },
];

export default routes;

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
  {
    path: 'code-block',
    loadComponent: () => import('./code-block/code-block-playground'),
    data: {
      name: 'Code block',
      icon: 'code',
      library: 'code',
    },
  },
];

export default routes;

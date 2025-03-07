import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./sectioned-form.component'),
    data: {
      name: 'Sectioned form',
      icon: 'form',
      library: 'tabs',
    },
  },
] as Route[];

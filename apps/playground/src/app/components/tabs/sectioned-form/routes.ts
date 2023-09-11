import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./sectioned-form.component'),
    data: {
      name: 'Sectioned form',
      icon: 'object-group',
      library: 'tabs',
    },
  },
] as Route[];

import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./country-field.component'),
    data: {
      name: 'Country field',
      icon: 'flag',
      library: 'lookup',
    },
  },
] as Route[];

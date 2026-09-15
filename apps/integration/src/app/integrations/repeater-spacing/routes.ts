import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./repeater-spacing.component'),
    data: {
      name: 'Repeater spacing',
      icon: 'arrow-repeat-all',
    },
  },
];
export default routes;

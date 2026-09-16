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
  {
    path: 'modal',
    loadComponent: () => import('./repeater-spacing-in-modal.component'),
    data: {
      name: 'Repeater spacing in modal',
      icon: 'arrow-repeat-all',
    },
  },
];
export default routes;

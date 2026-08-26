import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./repeater-in-a-box.component'),
    data: {
      name: 'Repeater in a Box',
      icon: 'arrow-repeat-all',
    },
  },
];
export default routes;

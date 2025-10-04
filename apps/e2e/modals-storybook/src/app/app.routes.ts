import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'confirm',
    loadChildren: () =>
      import('./confirm/confirm.module').then((m) => m.ConfirmModule),
  },
  {
    path: 'modal',
    loadChildren: () =>
      import('./modal/modal.module').then((m) => m.ModalModule),
  },
];

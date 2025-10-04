import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'toast',
    loadChildren: () =>
      import('./toast/toast.module').then((m) => m.ToastModule),
  },
];

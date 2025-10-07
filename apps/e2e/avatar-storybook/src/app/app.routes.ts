import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'avatar',
    loadChildren: () =>
      import('./avatar/avatar.module').then((m) => m.AvatarModule),
  },
];

import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'dock',
    loadChildren: () => import('./dock/dock.module').then((m) => m.DockModule),
  },
  {
    path: 'affix',
    loadChildren: () =>
      import('./affix/affix.module').then((m) => m.AffixModule),
  },
];

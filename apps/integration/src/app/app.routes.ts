import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'integrations',
    loadChildren: () =>
      import('./integrations/integrations.module').then(
        (m) => m.IntegrationsModule,
      ),
  },
];

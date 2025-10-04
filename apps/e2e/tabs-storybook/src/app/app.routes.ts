import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'wizard',
    loadChildren: () =>
      import('./wizard/wizard.module').then((m) => m.WizardModule),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsModule),
  },
  {
    path: 'vertical-tabs',
    loadChildren: () =>
      import('./vertical-tabs/vertical-tabs.module').then(
        (m) => m.VerticalTabsModule,
      ),
  },
];

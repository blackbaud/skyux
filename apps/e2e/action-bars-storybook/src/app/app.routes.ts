import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'summary-action-bar',
    loadChildren: () =>
      import('./summary-action-bar/summary-action-bar.module').then(
        (m) => m.SummaryActionBarModule,
      ),
  },
];

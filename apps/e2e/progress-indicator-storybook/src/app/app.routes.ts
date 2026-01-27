import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'progress-indicator',
    loadChildren: () =>
      import('./progress-indicator/progress-indicator.module').then(
        (m) => m.ProgressIndicatorModule,
      ),
  },
];

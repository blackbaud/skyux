import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'inline-form',
    loadChildren: () =>
      import('./inline-form/inline-form.module').then(
        (m) => m.InlineFormModule,
      ),
  },
];

import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'phone-field',
    loadChildren: () =>
      import('./phone-field/phone-field.module').then(
        (m) => m.PhoneFieldModule,
      ),
  },
];

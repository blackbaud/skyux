import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'colorpicker',
    loadChildren: () =>
      import('./colorpicker/colorpicker.module').then(
        (m) => m.ColorpickerModule,
      ),
  },
];

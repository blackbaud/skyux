import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'borders',
    loadChildren: () =>
      import('./borders/borders.module').then((m) => m.BordersModule),
  },
  {
    path: 'buttons',
    loadChildren: () =>
      import('./buttons/buttons.module').then((m) => m.ButtonsModule),
  },
  {
    path: 'responsive',
    loadChildren: () =>
      import('./responsive/responsive.module').then((m) => m.ResponsiveModule),
  },
  {
    path: 'switch-controls',
    loadChildren: () =>
      import('./switch-controls/switch-controls.module').then(
        (m) => m.SwitchControlsModule,
      ),
  },
  {
    path: 'theming',
    loadChildren: () =>
      import('./theming/theming.module').then((m) => m.ThemingModule),
  },
];

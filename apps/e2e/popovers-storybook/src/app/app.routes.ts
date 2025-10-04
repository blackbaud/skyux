import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'popover',
    loadChildren: () =>
      import('./popover/popover.module').then((m) => m.PopoverModule),
  },
  {
    path: 'dropdown',
    loadChildren: () =>
      import('./dropdown/dropdown.module').then((m) => m.DropdownModule),
  },
];

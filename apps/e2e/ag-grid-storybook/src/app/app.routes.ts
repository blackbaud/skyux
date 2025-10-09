import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'ag-grid-widgets',
    loadComponent: () =>
      import('./ag-grid-widgets/ag-grid-widgets.component').then(
        (m) => m.AgGridWidgetsComponent,
      ),
  },
  {
    path: 'data-manager',
    loadChildren: () =>
      import('./data-manager/data-manager.module').then(
        (m) => m.DataManagerModule,
      ),
  },
  {
    path: 'ag-grid',
    loadChildren: () =>
      import('./ag-grid/ag-grid-stories.module').then(
        (m) => m.AgGridStoriesModule,
      ),
  },
  {
    path: 'data-entry-grid',
    loadChildren: () =>
      import('./data-entry-grid/data-entry-grid.module').then(
        (m) => m.DataEntryGridModule,
      ),
  },
];

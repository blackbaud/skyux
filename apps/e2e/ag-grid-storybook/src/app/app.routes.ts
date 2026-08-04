import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'ag-grid-native-multiselect',
    loadComponent: () =>
      import('./ag-grid-native-multiselect/ag-grid-native-multiselect.component').then(
        (m) => m.AgGridMultiselectComponent,
      ),
  },
  {
    path: 'ag-grid-widgets',
    loadComponent: () =>
      import('./ag-grid-widgets/ag-grid-widgets.component').then(
        (m) => m.AgGridWidgetsComponent,
      ),
  },
  {
    path: 'data-manager',
    loadComponent: () =>
      import('./data-manager/data-manager.component').then(
        (m) => m.DataManagerComponent,
      ),
  },
  {
    path: 'ag-grid',
    loadComponent: () =>
      import('./ag-grid/ag-grid-stories.component').then(
        (m) => m.AgGridStoriesComponent,
      ),
  },
  {
    path: 'data-entry-grid',
    loadComponent: () =>
      import('./data-entry-grid/data-entry-grid.component').then(
        (m) => m.DataEntryGridComponent,
      ),
  },
];

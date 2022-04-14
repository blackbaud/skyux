import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'action-bars',
    loadChildren: () =>
      import('./features/action-bars.module').then((m) => m.ActionBarsModule),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./features/forms.module').then((m) => m.FormsModule),
  },
  {
    path: 'grids',
    loadChildren: () =>
      import('./features/grids.module').then((m) => m.GridsFeatureModule),
  },
  {
    path: 'layout',
    loadChildren: () =>
      import('./features/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'lists',
    loadChildren: () =>
      import('./features/lists.module').then((m) => m.ListsFeatureModule),
  },
  {
    path: 'lookup',
    loadChildren: () =>
      import('./features/lookup.module').then((m) => m.LookupModule),
  },
  {
    path: 'modals',
    loadChildren: () =>
      import('./features/modals.module').then((m) => m.ModalsFeatureModule),
  },
  {
    path: 'core',
    loadChildren: () =>
      import('./features/core.module').then((m) => m.CoreFeatureModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./features/tabs.module').then((m) => m.TabsFeatureModule),
  },
  {
    path: 'ag-grid',
    loadChildren: () =>
      import('./features/ag-grid.module').then((m) => m.AgGridFeatureModule),
  },
  {
    path: 'tiles',
    loadChildren: () =>
      import('./features/tiles.module').then((m) => m.TilesFeatureModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

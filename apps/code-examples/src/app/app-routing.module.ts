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
    path: 'layout',
    loadChildren: () =>
      import('./features/layout.module').then((m) => m.LayoutModule),
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

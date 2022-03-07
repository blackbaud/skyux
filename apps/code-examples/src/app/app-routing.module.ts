import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'action-bars',
    loadChildren: () =>
      import('./features/action-bars.module').then((m) => m.ActionBarsModule),
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'action-bars',
    loadChildren: () =>
      import('./features/action-bars.module').then((m) => m.ActionBarsModule),
  },
  {
    path: 'box',
    loadChildren: () =>
      import('./features/box.module').then((m) => m.BoxModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'buttons',
    loadChildren: () =>
      import('./buttons/buttons.module').then((m) => m.ButtonsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeRoutingModule {}

@NgModule({
  imports: [ThemeRoutingModule],
})
export class ThemeModule {}

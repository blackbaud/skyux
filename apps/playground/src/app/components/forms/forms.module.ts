import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'input-box',
    loadChildren: () =>
      import('./input-box/input-box.module').then((m) => m.InputBoxModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}

@NgModule({
  imports: [FormsRoutingModule],
})
export class FormsModule {}

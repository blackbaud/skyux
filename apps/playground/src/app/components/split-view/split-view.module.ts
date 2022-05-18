import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'split-view',
    loadChildren: () =>
      import('./split-view/split-view.module').then((m) => m.SplitViewModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitViewRoutingModule {}

@NgModule({
  imports: [SplitViewRoutingModule],
})
export class SplitViewModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'angular-tree-component',
    loadChildren: () =>
      import('./angular-tree-component/angular-tree-component.module').then(
        (m) => m.AngularTreeComponentModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngularTreeComponentRoutingModule {}

@NgModule({
  imports: [CommonModule, AngularTreeComponentRoutingModule],
})
export class AngularTreeComponentModule {
  public static routes = routes;
}

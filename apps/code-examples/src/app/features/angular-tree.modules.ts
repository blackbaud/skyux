import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'advanced',
    loadComponent: () =>
      import(
        '../code-examples/angular-tree-component/angular-tree/advanced/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'inline-help',
    loadComponent: () =>
      import(
        '../code-examples/angular-tree-component/angular-tree/inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AngularTreeFeatureModule {}

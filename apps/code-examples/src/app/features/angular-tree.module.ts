import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import(
        '../code-examples/angular-tree-component/angular-tree/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'help-key',
    loadComponent: () =>
      import(
        '../code-examples/angular-tree-component/angular-tree/help-key/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AngularTreeFeatureModule {}

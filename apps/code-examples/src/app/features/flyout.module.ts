import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import('../code-examples/flyout/flyout/basic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'custom-headers',
    loadComponent: () =>
      import(
        '../code-examples/flyout/flyout/custom-headers/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FlyoutFeatureModule {}

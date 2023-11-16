import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import('../code-examples/toast/toast/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'custom-component',
    loadComponent: () =>
      import(
        '../code-examples/toast/toast/custom-component/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ToastFeatureModule {}

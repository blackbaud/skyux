import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'confirm-with-controller',
    loadComponent: () =>
      import(
        '../code-examples/modals/confirm/basic-with-controller/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'confirm-with-harness',
    loadComponent: () =>
      import(
        '../code-examples/modals/confirm/basic-with-harness/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'modal-with-controller',
    loadComponent: () =>
      import(
        '../code-examples/modals/modal/basic-with-controller/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'modal-with-harness',
    loadComponent: () =>
      import(
        '../code-examples/modals/modal/basic-with-harness/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'modal-with-harness-help-key',
    loadComponent: () =>
      import(
        '../code-examples/modals/modal/basic-with-harness-help-key/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'modal-with-error',
    loadComponent: () =>
      import('../code-examples/modals/modal/with-error/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalsFeatureModule {}

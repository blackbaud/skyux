import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'confirm',
    loadComponent: () =>
      import('../code-examples/modals/confirm/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'modal',
    loadComponent: () =>
      import('../code-examples/modals/modal/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'inline-help',
    loadComponent: () =>
      import('../code-examples/modals/inline-help/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalsFeatureModule {}

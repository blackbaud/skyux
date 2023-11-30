import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'embedded',
    loadComponent: () =>
      import('../code-examples/errors/error/embedded/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'modal',
    loadComponent: () =>
      import('../code-examples/errors/error/modal/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ErrorsFeatureModule {}

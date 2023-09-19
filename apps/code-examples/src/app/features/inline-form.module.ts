import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import(
        '../code-examples/inline-form/inline-form/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'custom-buttons',
    loadComponent: () =>
      import(
        '../code-examples/inline-form/inline-form/custom-buttons/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'repeaters',
    loadComponent: () =>
      import(
        '../code-examples/inline-form/inline-form/repeaters/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class InlineFormFeatureModule {}

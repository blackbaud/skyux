import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'currency',
    loadComponent: () =>
      import(
        '../code-examples/autonumeric/autonumeric/currency/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'international-formatting',
    loadComponent: () =>
      import(
        '../code-examples/autonumeric/autonumeric/international-formatting/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'options-provider',
    loadComponent: () =>
      import(
        '../code-examples/autonumeric/autonumeric/options-provider/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'preset',
    loadComponent: () =>
      import(
        '../code-examples/autonumeric/autonumeric/preset/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AutonumericFeatureModule {}

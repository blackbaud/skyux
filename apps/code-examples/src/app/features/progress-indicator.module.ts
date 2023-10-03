import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'waterfall',
    loadComponent: () =>
      import(
        '../code-examples/progress-indicator/waterfall-indicator/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'passive',
    loadComponent: () =>
      import(
        '../code-examples/progress-indicator/passive-indicator/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'wizard',
    loadComponent: () =>
      import(
        '../code-examples/progress-indicator/wizard/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'passive/inline-help',
    loadComponent: () =>
      import(
        '../code-examples/progress-indicator/passive-indicator/inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'waterfall/inline-help',
    loadComponent: () =>
      import(
        '../code-examples/progress-indicator/waterfall-indicator/inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProgressIndicatorFeatureModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import(
        '../code-examples/action-bars/summary-action-bar/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'modal',
    loadComponent: () =>
      import(
        '../code-examples/action-bars/summary-action-bar/modal/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'tab',
    loadComponent: () =>
      import(
        '../code-examples/action-bars/summary-action-bar/tab/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ActionBarsModule {}

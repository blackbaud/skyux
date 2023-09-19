import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import(
        '../code-examples/split-view/split-view/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'page-bound',
    loadComponent: () =>
      import(
        '../code-examples/split-view/split-view/page-bound/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SplitViewModule {}

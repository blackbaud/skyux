import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'action-hub',
    loadComponent: () =>
      import('../code-examples/pages/action-hub/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'page/list-page-list-layout',
    loadComponent: () =>
      import(
        '../code-examples/pages/page/list-page-list-layout-demo/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'page/list-page-tabs-layout',
    loadComponent: () =>
      import(
        '../code-examples/pages/page/list-page-tabs-layout-demo/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'page/record-page-blocks-layout',
    loadComponent: () =>
      import(
        '../code-examples/pages/page/record-page-blocks-layout-demo/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'page/record-page-tabs-layout',
    loadComponent: () =>
      import(
        '../code-examples/pages/page/record-page-tabs-layout-demo/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'page/split-view-page-fit-layout',
    loadComponent: () =>
      import(
        '../code-examples/pages/page/split-view-page-fit-layout-demo/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'page/home-page-blocks-layout',
    loadComponent: () =>
      import(
        '../code-examples/pages/page/home-page-blocks-layout-demo/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PagesFeatureModule {}

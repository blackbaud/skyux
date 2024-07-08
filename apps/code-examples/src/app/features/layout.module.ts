import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'action-button/basic',
    loadComponent: () =>
      import('../code-examples/layout/action-button/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'action-button/permalink',
    loadComponent: () =>
      import(
        '../code-examples/layout/action-button/permalink/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'back-to-top/infinite-scroll',
    loadComponent: () =>
      import(
        '../code-examples/layout/back-to-top/infinite-scroll/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'back-to-top/repeater',
    loadComponent: () =>
      import(
        '../code-examples/layout/back-to-top/repeater/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'box/basic',
    loadComponent: () =>
      import('../code-examples/layout/box/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'card/basic',
    loadComponent: () =>
      import('../code-examples/layout/card/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'definition-list/basic',
    loadComponent: () =>
      import(
        '../code-examples/layout/definition-list/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'description-list/horizontal',
    loadComponent: () =>
      import(
        '../code-examples/layout/description-list/horizontal/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'description-list/inline-help',
    loadComponent: () =>
      import(
        '../code-examples/layout/description-list/inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'description-list/vertical',
    loadComponent: () =>
      import(
        '../code-examples/layout/description-list/vertical/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'description-list/long-description',
    loadComponent: () =>
      import(
        '../code-examples/layout/description-list/long-description/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'fluid-grid',
    loadComponent: () =>
      import('../code-examples/layout/fluid-grid/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'format',
    loadComponent: () =>
      import('../code-examples/layout/format/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'inline-delete/custom',
    loadComponent: () =>
      import(
        '../code-examples/layout/inline-delete/custom/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'inline-delete/repeater',
    loadComponent: () =>
      import(
        '../code-examples/layout/inline-delete/repeater/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'page',
    loadComponent: () =>
      import('../code-examples/layout/page/layout-fit/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'page-summary/basic',
    loadComponent: () =>
      import('../code-examples/layout/page-summary/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'text-expand/inline',
    loadComponent: () =>
      import('../code-examples/layout/text-expand/inline/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'text-expand/modal',
    loadComponent: () =>
      import('../code-examples/layout/text-expand/modal/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'text-expand/newline',
    loadComponent: () =>
      import('../code-examples/layout/text-expand/newline/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'text-expand-repeater',
    loadComponent: () =>
      import(
        '../code-examples/layout/text-expand-repeater/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'toolbar/basic',
    loadComponent: () =>
      import('../code-examples/layout/toolbar/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'toolbar/sectioned',
    loadComponent: () =>
      import('../code-examples/layout/toolbar/sectioned/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LayoutModule {}

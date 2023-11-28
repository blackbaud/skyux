import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'filter/inline',
    loadComponent: () =>
      import('../code-examples/lists/filter/inline/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'filter/modal',
    loadComponent: () =>
      import('../code-examples/lists/filter/modal/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'infinite-scroll/repeater',
    loadComponent: () =>
      import(
        '../code-examples/lists/infinite-scroll/repeater/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'paging/basic',
    loadComponent: () =>
      import('../code-examples/lists/paging/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'repeater/add-remove',
    loadComponent: () =>
      import('../code-examples/lists/repeater/add-remove/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'repeater/basic',
    loadComponent: () =>
      import('../code-examples/lists/repeater/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },

  {
    path: 'repeater/inline-form',
    loadComponent: () =>
      import('../code-examples/lists/repeater/inline-form/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'sort/basic',
    loadComponent: () =>
      import('../code-examples/lists/sort/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ListsFeatureModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sectioned-form/modal',
    loadComponent: () =>
      import('../code-examples/tabs/sectioned-form/modal/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'tabs/dynamic',
    loadComponent: () =>
      import('../code-examples/tabs/tabs/dynamic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'tabs/dynamic-add-close',
    loadComponent: () =>
      import(
        '../code-examples/tabs/tabs/dynamic-add-close/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'tabs/static',
    loadComponent: () =>
      import('../code-examples/tabs/tabs/static/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'tabs/static-add-close',
    loadComponent: () =>
      import('../code-examples/tabs/tabs/static-add-close/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'vertical-tabs/basic',
    loadComponent: () =>
      import('../code-examples/tabs/vertical-tabs/basic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'vertical-tabs/grouped',
    loadComponent: () =>
      import('../code-examples/tabs/vertical-tabs/grouped/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'tabs/wizard/basic',
    loadComponent: () =>
      import('../code-examples/tabs/wizard/basic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsFeatureModule {}

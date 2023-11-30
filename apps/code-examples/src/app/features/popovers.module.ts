import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dropdown/basic',
    loadComponent: () =>
      import('../code-examples/popovers/dropdown/basic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'popover/basic',
    loadComponent: () =>
      import('../code-examples/popovers/popover/basic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'popover/programmatic',
    loadComponent: () =>
      import(
        '../code-examples/popovers/popover/programmatic/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PopoversFeatureModule {}

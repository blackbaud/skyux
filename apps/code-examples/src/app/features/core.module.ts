import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'id',
    loadComponent: () =>
      import('../code-examples/core/id/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'media-query/basic',
    loadComponent: () =>
      import('../code-examples/core/media-query/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'media-query/container-breakpoint-observer',
    loadComponent: () =>
      import(
        '../code-examples/core/media-query/container-breakpoint-observer/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'numeric/basic',
    loadComponent: () =>
      import('../code-examples/core/numeric/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CoreFeatureModule {}

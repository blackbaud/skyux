import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import('../code-examples/tiles/tiles/basic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'inline-help',
    loadComponent: () =>
      import('../code-examples/tiles/tiles/inline-help/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TilesFeatureModule {}

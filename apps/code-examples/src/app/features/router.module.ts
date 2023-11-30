import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'href/basic',
    loadComponent: () =>
      import('../code-examples/router/href/basic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class RouterFeatureModule {}

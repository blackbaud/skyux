import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import('../code-examples/icon/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('../code-examples/icon/icon-button/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class IconFeatureModule {}

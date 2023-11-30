import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'box/basic',
    loadComponent: () =>
      import('../code-examples/theme/box/basic/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'status-indicator/basic',
    loadComponent: () =>
      import(
        '../code-examples/theme/status-indicator/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ThemesFeatureModule {}

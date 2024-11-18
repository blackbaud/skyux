import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import(
        '../code-examples/colorpicker/colorpicker/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'programmatic',
    loadComponent: () =>
      import(
        '../code-examples/colorpicker/colorpicker/programmatic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'help-key',
    loadComponent: () =>
      import(
        '../code-examples/colorpicker/colorpicker/help-key/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ColorpickerFeatureModule {}

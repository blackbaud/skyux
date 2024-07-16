import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'basic',
    loadComponent: () =>
      import('../code-examples/help-inline/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class HelpInlineFeatureModule {}

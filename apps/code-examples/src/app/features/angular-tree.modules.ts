import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularTreeDemoComponent } from '../code-examples/angular-tree-component/angular-tree/advanced/angular-tree-demo.component';
import { AngularTreeDemoModule } from '../code-examples/angular-tree-component/angular-tree/advanced/angular-tree-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: AngularTreeDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngularTreeRoutingModule {}

@NgModule({
  imports: [AngularTreeDemoModule],
})
export class AngularTreeFeatureModule {}

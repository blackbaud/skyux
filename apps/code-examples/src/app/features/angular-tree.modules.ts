import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularTreeDemoComponent } from '../code-examples/angular-tree-component/angular-tree/advanced/angular-tree-demo.component';
import { AngularTreeDemoModule } from '../code-examples/angular-tree-component/angular-tree/advanced/angular-tree-demo.module';
import { AngularTreeDemoComponent as AngularTreeInlineHelpDemoComponent } from '../code-examples/angular-tree-component/angular-tree/inline-help/angular-tree-demo.component';
import { AngularTreeDemoModule as AngularTreeInlineHelpDemoModule } from '../code-examples/angular-tree-component/angular-tree/inline-help/angular-tree-demo.module';

const routes: Routes = [
  {
    path: 'advanced',
    component: AngularTreeDemoComponent,
  },
  {
    path: 'inline-help',
    component: AngularTreeInlineHelpDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngularTreeRoutingModule {}

@NgModule({
  imports: [
    AngularTreeDemoModule,
    AngularTreeRoutingModule,
    AngularTreeInlineHelpDemoModule,
  ],
})
export class AngularTreeFeatureModule {}

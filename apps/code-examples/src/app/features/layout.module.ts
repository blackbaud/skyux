import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxDemoComponent } from '../code-examples/layout/box/basic/box-demo.component';
import { BoxDemoModule } from '../code-examples/layout/box/basic/box-demo.module';

const routes: Routes = [
  {
    path: 'box/basic',
    component: BoxDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}

@NgModule({
  imports: [BoxDemoModule, LayoutRoutingModule],
})
export class LayoutModule {}

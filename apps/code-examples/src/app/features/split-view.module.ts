import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SplitViewDemoComponent } from '../code-examples/split-view/split-view/basic/split-view-demo.component';
import { SplitViewDemoModule as SplitViewBasicDemoModule } from '../code-examples/split-view/split-view/basic/split-view-demo.module';
import { SplitViewPageBoundDemoComponent } from '../code-examples/split-view/split-view/page-bound/split-view-page-bound-demo.component';
import { SplitViewDemoModule as SplitViewPageBoundDemoModule } from '../code-examples/split-view/split-view/page-bound/split-view-page-bound-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: SplitViewDemoComponent,
  },
  {
    path: 'page-bound',
    component: SplitViewPageBoundDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitViewRoutingModule {}

@NgModule({
  imports: [
    SplitViewBasicDemoModule,
    SplitViewPageBoundDemoModule,
    SplitViewRoutingModule,
  ],
})
export class SplitViewModule {}

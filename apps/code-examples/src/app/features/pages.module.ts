import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionHubDemoComponent } from '../code-examples/pages/action-hub/action-hub-demo.component';
import { ActionHubDemoModule } from '../code-examples/pages/action-hub/action-hub-demo.module';
import { ListPageListLayoutDemoComponent } from '../code-examples/pages/page/list-page-list-layout-demo/list-page-list-layout-demo.component';
import { ListPageListLayoutDemoModule } from '../code-examples/pages/page/list-page-list-layout-demo/list-page-list-layout-demo.module';
import { ListPageTabsLayoutDemoComponent } from '../code-examples/pages/page/list-page-tabs-layout-demo/list-page-tabs-layout-demo.component';
import { ListPageTabsLayoutDemoModule } from '../code-examples/pages/page/list-page-tabs-layout-demo/list-page-tabs-layout-demo.module';
import { RecordPageBlocksLayoutDemoComponent } from '../code-examples/pages/page/record-page-blocks-layout-demo/record-page-blocks-layout-demo.component';
import { RecordPageBlocksLayoutDemoModule } from '../code-examples/pages/page/record-page-blocks-layout-demo/record-page-blocks-layout-demo.module';
import { RecordPageTabsLayoutDemoComponent } from '../code-examples/pages/page/record-page-tabs-layout-demo/record-page-tabs-layout-demo.component';
import { RecordPageTabsLayoutDemoModule } from '../code-examples/pages/page/record-page-tabs-layout-demo/record-page-tabs-layout-demo.module';
import { SplitViewPageFitLayoutDemoComponent } from '../code-examples/pages/page/split-view-page-fit-layout-demo/split-view-page-fit-layout-demo.component';
import { SplitViewPageFitLayoutDemoModule } from '../code-examples/pages/page/split-view-page-fit-layout-demo/split-view-page-fit-layout-demo.module';

const routes: Routes = [
  { path: 'action-hub', component: ActionHubDemoComponent },
  {
    path: 'page/list-page-list-layout',
    component: ListPageListLayoutDemoComponent,
  },
  {
    path: 'page/list-page-tabs-layout',
    component: ListPageTabsLayoutDemoComponent,
  },
  {
    path: 'page/record-page-blocks-layout',
    component: RecordPageBlocksLayoutDemoComponent,
  },
  {
    path: 'page/record-page-tabs-layout',
    component: RecordPageTabsLayoutDemoComponent,
  },
  {
    path: 'page/split-view-page-fit-layout',
    component: SplitViewPageFitLayoutDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesFeatureRoutingModule {}

@NgModule({
  imports: [
    ActionHubDemoModule,
    ListPageListLayoutDemoModule,
    ListPageTabsLayoutDemoModule,
    PagesFeatureRoutingModule,
    RecordPageBlocksLayoutDemoModule,
    RecordPageTabsLayoutDemoModule,
    SplitViewPageFitLayoutDemoModule,
  ],
})
export class PagesFeatureModule {}

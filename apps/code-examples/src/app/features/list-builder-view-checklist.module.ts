import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// TODO: add story for list view checklist demo

// import { ListViewChecklistDemoComponent } from '../code-examples/list-builder-view-checklist/list-view-checklist/basic/list-view-checklist-demo.component';
// import { ListViewChecklistDemoModule } from '../code-examples/list-builder-view-checklist/list-view-checklist/basic/list-view-checklist-demo.module';

const routes: Routes = [
  // {
  //   path: 'basic',
  //   component: ListViewChecklistDemoComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListBuilderViewChecklistRoutingModule {}

@NgModule({
  imports: [
    ListBuilderViewChecklistRoutingModule,
    // ListViewChecklistDemoModule,
  ],
})
export class ListBuilderViewChecklistFeatureModule {}

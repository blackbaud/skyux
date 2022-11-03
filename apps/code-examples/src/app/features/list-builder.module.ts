import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// TODO: add story for list builder

// import { ListFiltersDemoComponent } from '../code-examples/list-builder/list-filters/inline-filters/list-filters-demo.component';
// import { ListFiltersDemoModule } from '../code-examples/list-builder/list-filters/inline-filters/list-filters-demo.module';
// import { ListFilterDemoModalComponent } from '../code-examples/list-builder/list-filters/modal-filters/list-filters-demo-modal.component';
// import { ListFiltersModalModule } from '../code-examples/list-builder/list-filters/modal-filters/list-filters-demo.module';
// import { ListPagingDemoComponent } from '../code-examples/list-builder/list-paging/basic/list-paging-demo.component';
// import { ListPagingDemoModule } from '../code-examples/list-builder/list-paging/basic/list-paging-demo.module';
// import { ListToolbarDemoComponent } from '../code-examples/list-builder/list-toolbar/basic/list-toolbar-demo.component';
// import { ListToolbarDemoModule } from '../code-examples/list-builder/list-toolbar/basic/list-toolbar-demo.module';
// import { ListToolbarDemoComponent as ListToolbarCustomComponent } from '../code-examples/list-builder/list-toolbar/custom/list-toolbar-demo.component';
// import { ListToolbarDemoModule as ListToolbarCustomModule } from '../code-examples/list-builder/list-toolbar/custom/list-toolbar-demo.module';

const routes: Routes = [
  // {
  //   path: 'list-filters/inline-filters',
  //   component: ListFiltersDemoComponent,
  // },
  // {
  //   path: 'list-filters/modal-filters',
  //   component: ListFilterDemoModalComponent,
  // },
  // {
  //   path: 'list-paging/basic',
  //   component: ListPagingDemoComponent,
  // },
  // {
  //   path: 'list-toolbar/basic',
  //   component: ListToolbarDemoComponent,
  // },
  // {
  //   path: 'list-toolbar/custom',
  //   component: ListToolbarCustomComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListBuilderRoutingModule {}

@NgModule({
  imports: [
    ListBuilderRoutingModule,
    // ListFiltersDemoModule,
    // ListFiltersModalModule,
    // ListPagingDemoModule,
    // ListToolbarDemoModule,
    // ListToolbarCustomModule,
  ],
})
export class ListBuilderFeatureModule {}

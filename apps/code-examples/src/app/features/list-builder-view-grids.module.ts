import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// TODO add stories for list view grid

// import { ListViewGridDemoComponent } from '../code-examples/list-builder-view-grids/list-view-grid/column-selector/list-view-grid-demo.component';
// import { ListViewGridDemoModule } from '../code-examples/list-builder-view-grids/list-view-grid/column-selector/list-view-grid-demo.module';
// import { ListViewGridDemoComponent as ListViewDataProviderComponent } from '../code-examples/list-builder-view-grids/list-view-grid/data-provider/list-view-grid-demo.component';
// import { ListViewGridDemoModule as ListViewDataProdiverModule } from '../code-examples/list-builder-view-grids/list-view-grid/data-provider/list-view-grid-demo.module';
// import { ListViewGridDemoComponent as ListViewMultiselectComponent } from '../code-examples/list-builder-view-grids/list-view-grid/multiselect/list-view-grid-demo.component';
// import { ListViewGridDemoModule as ListViewMultiselectProdiverModule } from '../code-examples/list-builder-view-grids/list-view-grid/multiselect/list-view-grid-demo.module';
// import { ListViewGridDemoComponent as ListViewTemplatedColumnComponent } from '../code-examples/list-builder-view-grids/list-view-grid/templated-column/list-view-grid-demo.component';
// import { ListViewGridDDemoModule as ListViewTemplatedColumnProviderModule } from '../code-examples/list-builder-view-grids/list-view-grid/templated-column/list-view-grid-demo.module';

const routes: Routes = [
  // {
  //   path: 'column-selector',
  //   component: ListViewGridDemoComponent,
  // },
  // {
  //   path: 'data-provider',
  //   component: ListViewDataProviderComponent,
  // },
  // {
  //   path: 'multiselect',
  //   component: ListViewMultiselectComponent,
  // },
  // {
  //   path: 'templated-column',
  //   component: ListViewTemplatedColumnComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListBuilderViewGridsFeatureRoutingModule {}

@NgModule({
  imports: [
    ListBuilderViewGridsFeatureRoutingModule,
    // ListViewGridDemoModule,
    // ListViewDataProdiverModule,
    // ListViewMultiselectProdiverModule,
    // ListViewTemplatedColumnProviderModule,
  ],
})
export class ListBuilderViewGridsFeatureModule {}

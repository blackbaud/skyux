import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DemoComponent as BasicDataEntryGridComponent } from '../code-examples/ag-grid/data-entry-grid/basic/demo.component';
import { DemoComponent as DataManagerDataEntryGridComponent } from '../code-examples/ag-grid/data-entry-grid/data-manager-added/demo.component';
import { DemoComponent as InlineHelpDataEntryGridComponent } from '../code-examples/ag-grid/data-entry-grid/inline-help/demo.component';
import { BasicMultiselectDataGridDemoComponent as DataGridBasicMultiselectDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/basic-multiselect/basic-multiselect-data-grid-docs-demo.component';
import { BasicMultiselectDataGridDemoModule } from '../code-examples/ag-grid/data-grid/basic-multiselect/basic-multiselect-data-grid-docs-demo.module';
import { BasicDataGridDemoComponent as DataGridBasicDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/basic/basic-data-grid-docs-demo.component';
import { BasicDataGridDemoModule as DataGridBasicBasicDataGridDemoModule } from '../code-examples/ag-grid/data-grid/basic/basic-data-grid-docs-demo.module';
import { DataManagerMultiselectDataGridDemoComponent as DataGridDataManagerAddedDataManagerMultiselectDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/data-manager-multiselect/data-manager-multiselect-data-grid-docs-demo.component';
import { DataManagerMultiselectDataGridDemoModule } from '../code-examples/ag-grid/data-grid/data-manager-multiselect/data-manager-multiselect-data-grid-docs-demo.module';
import { DataManagerDataGridDemoComponent as DataGridDataManagerAddedDataManagerDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/data-manager/data-manager-data-grid-docs-demo.component';
import { DataManagerDataGridDemoModule } from '../code-examples/ag-grid/data-grid/data-manager/data-manager-data-grid-docs-demo.module';
import { DataGridDemoComponent as InlineHelpDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/inline-help/data-grid-demo.component';
import { DataGridDemoModule as InlineHelpDataGridDemoModule } from '../code-examples/ag-grid/data-grid/inline-help/data-grid-demo.module';
import { DataGridPagingDemoComponent } from '../code-examples/ag-grid/data-grid/paging/data-grid-paging-demo.component';
import { DataGridPagingDemoModule } from '../code-examples/ag-grid/data-grid/paging/data-grid-paging-demo.module';
import { TopScrollDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/top-scroll/top-scroll-data-grid-demo.component';
import { TopScrollDataGridDemoModule } from '../code-examples/ag-grid/data-grid/top-scroll/top-scroll-data-grid-demo.module';

const routes: Routes = [
  {
    path: 'data-entry-grid/basic',
    component: BasicDataEntryGridComponent,
  },
  {
    path: 'data-entry-grid/data-manager-added',
    component: DataManagerDataEntryGridComponent,
  },
  {
    path: 'data-entry-grid/inline-help',
    component: InlineHelpDataEntryGridComponent,
  },
  {
    path: 'data-grid/basic',
    component: DataGridBasicDataGridDemoComponent,
  },
  {
    path: 'data-grid/basic-multiselect',
    component: DataGridBasicMultiselectDataGridDemoComponent,
  },
  {
    path: 'data-grid/data-manager',
    component: DataGridDataManagerAddedDataManagerDataGridDemoComponent,
  },
  {
    path: 'data-grid/data-manager-multiselect',
    component:
      DataGridDataManagerAddedDataManagerMultiselectDataGridDemoComponent,
  },
  {
    path: 'data-grid/top-scroll',
    component: TopScrollDataGridDemoComponent,
  },
  {
    path: 'data-grid/inline-help',
    component: InlineHelpDataGridDemoComponent,
  },
  {
    path: 'data-grid/paging',
    component: DataGridPagingDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgGridFeatureRoutingModule {}

@NgModule({
  imports: [
    BasicDataEntryGridComponent,
    DataManagerDataEntryGridComponent,
    InlineHelpDataEntryGridComponent,
    DataGridBasicBasicDataGridDemoModule,
    DataGridPagingDemoModule,
    InlineHelpDataGridDemoModule,
    BasicMultiselectDataGridDemoModule,
    DataManagerDataGridDemoModule,
    DataManagerMultiselectDataGridDemoModule,
    TopScrollDataGridDemoModule,
    AgGridFeatureRoutingModule,
  ],
})
export class AgGridFeatureModule {}

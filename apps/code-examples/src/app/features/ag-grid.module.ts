import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataEntryGridDemoComponent as DataEntryGridBasicDataEntryGridDemoComponent } from '../code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-demo.component';
import { DataEntryGridDemoModule as DataEntryGridBasicDataEntryGridDemoModule } from '../code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-demo.module';
import { DataManagerDataEntryGridDemoComponent as DataEntryGridDataManagerAddedDataManagerDataEntryGridDemoComponent } from '../code-examples/ag-grid/data-entry-grid/data-manager-added/data-manager-data-entry-grid-demo.component';
import { DataManagerDataEntryGridDemoModule as DataEntryGridDataManagerAddedDataManagerDataEntryGridDemoModule } from '../code-examples/ag-grid/data-entry-grid/data-manager-added/data-manager-data-entry-grid-demo.module';
import { DataEntryGridDemoComponent as DataEntryGridInlineHelpDataEntryGridDemoComponent } from '../code-examples/ag-grid/data-entry-grid/inline-help/data-entry-grid-demo.component';
import { DataEntryGridDemoModule as DataEntryGridInlineHelpDataEntryGridDemoModule } from '../code-examples/ag-grid/data-entry-grid/inline-help/data-entry-grid-demo.module';
import { BasicMultiselectDataGridDemoComponent as DataGridBasicMultiselectDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/basic-multiselect/basic-multiselect-data-grid-demo.component';
import { BasicMultiselectDataGridDemoModule } from '../code-examples/ag-grid/data-grid/basic-multiselect/basic-multiselect-data-grid-demo.module';
import { BasicDataGridDemoComponent as DataGridBasicDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/basic/basic-data-grid-demo.component';
import { BasicDataGridDemoModule as DataGridBasicBasicDataGridDemoModule } from '../code-examples/ag-grid/data-grid/basic/basic-data-grid-demo.module';
import { DataManagerMultiselectDataGridDemoComponent as DataGridDataManagerAddedDataManagerMultiselectDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/data-manager-multiselect/data-manager-multiselect-data-grid-demo.component';
import { DataManagerMultiselectDataGridDemoModule } from '../code-examples/ag-grid/data-grid/data-manager-multiselect/data-manager-multiselect-data-grid-demo.module';
import { DataManagerDataGridDemoComponent as DataGridDataManagerAddedDataManagerDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/data-manager/data-manager-data-grid-demo.component';
import { DataManagerDataGridDemoModule } from '../code-examples/ag-grid/data-grid/data-manager/data-manager-data-grid-demo.module';
import { DataGridDemoComponent as InlineHelpDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/inline-help/data-grid-demo.component';
import { DataGridDemoModule as InlineHelpDataGridDemoModule } from '../code-examples/ag-grid/data-grid/inline-help/data-grid-demo.module';
import { DataGridPagingDemoComponent } from '../code-examples/ag-grid/data-grid/paging/data-grid-paging-demo.component';
import { DataGridPagingDemoModule } from '../code-examples/ag-grid/data-grid/paging/data-grid-paging-demo.module';
import { TopScrollDataGridDemoComponent } from '../code-examples/ag-grid/data-grid/top-scroll/top-scroll-data-grid-demo.component';
import { TopScrollDataGridDemoModule } from '../code-examples/ag-grid/data-grid/top-scroll/top-scroll-data-grid-demo.module';

const routes: Routes = [
  {
    path: 'data-entry-grid/basic',
    component: DataEntryGridBasicDataEntryGridDemoComponent,
  },
  {
    path: 'data-entry-grid/data-manager-added',
    component:
      DataEntryGridDataManagerAddedDataManagerDataEntryGridDemoComponent,
  },
  {
    path: 'data-entry-grid/inline-help',
    component: DataEntryGridInlineHelpDataEntryGridDemoComponent,
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
    DataEntryGridBasicDataEntryGridDemoModule,
    DataEntryGridDataManagerAddedDataManagerDataEntryGridDemoModule,
    DataEntryGridInlineHelpDataEntryGridDemoModule,
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

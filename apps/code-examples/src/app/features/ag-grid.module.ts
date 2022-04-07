import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkyDataEntryGridDemoComponent as DataEntryGridBasicDataEntryGridDocsDemoComponent } from '../code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-docs-demo.component';
import { SkyDataEntryGridDocsDemoModule as DataEntryGridBasicDataEntryGridDocsDemoModule } from '../code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-docs-demo.module';
import { SkyDataManagerDataEntryGridDemoComponent as DataEntryGridDataManagerAddedDataManagerDataEntryGridDocsDemoComponent } from '../code-examples/ag-grid/data-entry-grid/data-manager-added/data-manager-data-entry-grid-docs-demo.component';
import { SkyDataManagerDataEntryGridDocsDemoModule as DataEntryGridDataManagerAddedDataManagerDataEntryGridDocsDemoModule } from '../code-examples/ag-grid/data-entry-grid/data-manager-added/data-manager-data-entry-grid-docs-demo.module';
import { SkyBasicDataGridDemoComponent as DataGridBasicBasicDataGridDocsDemoComponent } from '../code-examples/ag-grid/data-grid/basic/basic-data-grid-docs-demo.component';
import { SkyBasicDataGridDocsDemoModule as DataGridBasicBasicDataGridDocsDemoModule } from '../code-examples/ag-grid/data-grid/basic/basic-data-grid-docs-demo.module';
import { SkyDataManagerDataGridDemoComponent as DataGridDataManagerAddedDataManagerDataGridDocsDemoComponent } from '../code-examples/ag-grid/data-grid/data-manager-added/data-manager-data-grid-docs-demo.component';
import { SkyDataManagerDataGridDocsDemoModule as DataGridDataManagerAddedDataManagerDataGridDocsDemoModule } from '../code-examples/ag-grid/data-grid/data-manager-added/data-manager-data-grid-docs-demo.module';

const routes: Routes = [
  {
    path: 'data-entry-grid/basic',
    component: DataEntryGridBasicDataEntryGridDocsDemoComponent,
  },
  {
    path: 'data-entry-grid/data-manager-added',
    component:
      DataEntryGridDataManagerAddedDataManagerDataEntryGridDocsDemoComponent,
  },
  {
    path: 'data-grid/basic',
    component: DataGridBasicBasicDataGridDocsDemoComponent,
  },
  {
    path: 'data-grid/data-manager-added',
    component: DataGridDataManagerAddedDataManagerDataGridDocsDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgGridFeatureRoutingModule {}

@NgModule({
  imports: [
    DataEntryGridBasicDataEntryGridDocsDemoModule,
    DataEntryGridDataManagerAddedDataManagerDataEntryGridDocsDemoModule,
    DataGridBasicBasicDataGridDocsDemoModule,
    DataGridDataManagerAddedDataManagerDataGridDocsDemoModule,
    AgGridFeatureRoutingModule,
  ],
})
export class AgGridFeatureModule {}

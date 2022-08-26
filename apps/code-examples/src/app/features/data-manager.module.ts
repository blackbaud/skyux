import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataManagerDemoComponent as DataManagerBasicDataManagerDemoComponent } from '../code-examples/data-manager/data-manager/basic/data-manager-demo.component';
import { DataManagerDemoModule as DataManagerBasicDataManagerDemoModule } from '../code-examples/data-manager/data-manager/basic/data-manager-demo.module';

const routes: Routes = [
  { path: 'basic', component: DataManagerBasicDataManagerDemoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagerFeatureRoutingModule {}

@NgModule({
  imports: [
    DataManagerBasicDataManagerDemoModule,
    DataManagerFeatureRoutingModule,
  ],
})
export class DataManagerFeatureModule {}

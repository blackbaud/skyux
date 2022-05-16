import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataManagerLargeComponent } from './data-manager-large.component';

const routes: Routes = [{ path: '', component: DataManagerLargeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagerLargeRoutingModule {}

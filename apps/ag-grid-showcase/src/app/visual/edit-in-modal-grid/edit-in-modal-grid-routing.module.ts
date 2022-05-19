import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkyAgGridDemoComponent } from './ag-grid-demo.component';

const routes: Routes = [{ path: '', component: SkyAgGridDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditInModalGridRoutingModule {}

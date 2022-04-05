import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditComplexCellsComponent } from './edit-complex-cells.component';

const routes: Routes = [{ path: '', component: EditComplexCellsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditComplexCellsRoutingModule {}

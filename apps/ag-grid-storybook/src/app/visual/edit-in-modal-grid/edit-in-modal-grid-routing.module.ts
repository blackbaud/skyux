import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditInModalComponent } from './edit-in-modal.component';

const routes: Routes = [{ path: '', component: EditInModalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditInModalGridRoutingModule {}

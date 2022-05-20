import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditStopWhenLosesFocusComponent } from './edit-stop-when-loses-focus.component';

const routes: Routes = [
  { path: '', component: EditStopWhenLosesFocusComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditStopWhenLosesFocusRoutingModule {}

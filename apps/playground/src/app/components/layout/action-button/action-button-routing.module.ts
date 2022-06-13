import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionButtonComponent } from './action-button.component';

const routes: Routes = [{ path: '', component: ActionButtonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionButtonRoutingModule {}

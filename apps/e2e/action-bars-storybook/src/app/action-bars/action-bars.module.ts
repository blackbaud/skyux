import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionBarsComponent } from './action-bars.component';

const routes: Routes = [{ path: '', component: ActionBarsComponent }];
@NgModule({
  declarations: [ActionBarsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [ActionBarsComponent],
})
export class ActionBarsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RepeaterComponent } from './repeater.component';

const routes: Routes = [{ path: '', component: RepeaterComponent }];
@NgModule({
  declarations: [RepeaterComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RepeaterComponent],
})
export class RepeaterModule {}

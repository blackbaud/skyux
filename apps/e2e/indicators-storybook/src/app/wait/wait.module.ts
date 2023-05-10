import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyWaitModule } from '@skyux/indicators';

import { WaitComponent } from './wait.component';

const routes: Routes = [{ path: '', component: WaitComponent }];
@NgModule({
  declarations: [WaitComponent],
  imports: [CommonModule, SkyWaitModule, RouterModule.forChild(routes)],
  exports: [WaitComponent],
})
export class WaitModule {}

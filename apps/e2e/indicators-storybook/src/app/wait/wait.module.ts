import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { SkyWaitModule } from '@skyux/indicators';

import { WaitComponent } from './wait.component';

const routes: Routes = [{ path: '', component: WaitComponent }];
@NgModule({
  declarations: [WaitComponent],
  imports: [
    CommonModule,
    SkyWaitModule,
    RouterModule.forChild(routes),
    NoopAnimationsModule,
  ],
  exports: [WaitComponent],
})
export class WaitModule {}

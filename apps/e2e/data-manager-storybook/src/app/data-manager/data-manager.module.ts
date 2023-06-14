import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';
import { SkyRadioModule } from '@skyux/forms';

import { DataManagerComponent } from './data-manager.component';

const routes: Routes = [{ path: '', component: DataManagerComponent }];
@NgModule({
  declarations: [DataManagerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyDataManagerModule,
    SkyRadioModule,
  ],
  exports: [DataManagerComponent],
  providers: [SkyDataManagerService],
})
export class DataManagerModule {}

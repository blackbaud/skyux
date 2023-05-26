import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataManagerComponent } from './data-manager.component';

const routes: Routes = [{ path: '', component: DataManagerComponent }];
@NgModule({
  declarations: [DataManagerComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [DataManagerComponent],
})
export class DataManagerModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmComponent } from './confirm.component';

const routes: Routes = [{ path: '', component: ConfirmComponent }];

@NgModule({
  declarations: [ConfirmComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [ConfirmComponent],
})
export class ConfirmModule {}

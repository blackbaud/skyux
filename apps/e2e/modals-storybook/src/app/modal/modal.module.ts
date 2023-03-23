import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModalComponent } from './modal.component';

const routes: Routes = [{ path: '', component: ModalComponent }];
@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [ModalComponent],
})
export class ModalModule {}

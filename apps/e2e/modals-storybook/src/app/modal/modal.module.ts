import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyModalModule } from '@skyux/modals';

import { ModalComponent } from './modal.component';
import { ModalModalComponent } from './modal/modal-modal.component';

const routes: Routes = [{ path: '', component: ModalComponent }];
@NgModule({
  declarations: [ModalComponent, ModalModalComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyModalModule],
  exports: [ModalComponent],
})
export class ModalModule {}

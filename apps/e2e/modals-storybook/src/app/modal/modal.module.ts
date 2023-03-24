import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';

import { ModalComponent } from './modal.component';
import { ModalBasicComponent } from './modals/modal-basic.component';

const routes: Routes = [{ path: '', component: ModalComponent }];
@NgModule({
  declarations: [ModalComponent, ModalBasicComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyModalModule,
    SkyHelpInlineModule,
  ],
  exports: [ModalComponent],
})
export class ModalModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';

import { ModalDemoModalComponent } from './modal-demo-modal.component';
import { ModalDemoComponent } from './modal-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyWaitModule,
  ],
  declarations: [ModalDemoComponent, ModalDemoModalComponent],
  exports: [ModalDemoComponent],
})
export class ModalDemoModule {}

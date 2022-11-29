import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

import { ModalDemoModalComponent } from './modal-demo-modal.component';
import { ModalDemoComponent } from './modal-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
  declarations: [ModalDemoComponent, ModalDemoModalComponent],
  exports: [ModalDemoComponent],
})
export class ModalDemoModule {}

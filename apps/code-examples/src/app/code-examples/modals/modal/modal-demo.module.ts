import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

import { ModalDemoModalComponent } from './modal-demo-modal.component';
import { ModalDemoComponent } from './modal-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
  declarations: [ModalDemoComponent, ModalDemoModalComponent],
  exports: [ModalDemoComponent],
  entryComponents: [ModalDemoModalComponent],
})
export class ModalDemoModule {}

import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  ModalDemoComponent
} from './modal-demo.component';

import {
  ModalDemoModalComponent
} from './modal-demo-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyModalModule
  ],
  declarations: [
    ModalDemoComponent,
    ModalDemoModalComponent
  ],
  exports: [
    ModalDemoComponent
  ],
  entryComponents: [
    ModalDemoModalComponent
  ]
})

export class ModalDemoModule {
}

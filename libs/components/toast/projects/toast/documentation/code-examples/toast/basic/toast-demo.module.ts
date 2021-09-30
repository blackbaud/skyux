import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyToastModule
} from '@skyux/toast';

import {
  ToastDemoComponent
} from './toast-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyToastModule
  ],
  declarations: [
    ToastDemoComponent
  ],
  exports: [
    ToastDemoComponent
  ]
})
export class ToastDemoModule { }

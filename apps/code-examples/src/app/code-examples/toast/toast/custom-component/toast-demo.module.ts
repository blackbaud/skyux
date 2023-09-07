import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastContentDemoComponent } from './toast-content-demo.component';
import { ToastDemoComponent } from './toast-demo.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ToastContentDemoComponent, ToastDemoComponent],
  exports: [ToastDemoComponent],
})
export class ToastDemoModule {}

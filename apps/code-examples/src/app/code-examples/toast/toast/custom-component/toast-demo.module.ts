import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastDemoComponent } from './toast-demo.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ToastDemoComponent],
  exports: [ToastDemoComponent],
})
export class ToastDemoModule {}

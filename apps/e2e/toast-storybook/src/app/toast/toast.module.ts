import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToastCustomComponent } from './toast-custom.component';
import { ToastComponent } from './toast.component';

const routes: Routes = [{ path: '', component: ToastComponent }];
@NgModule({
  declarations: [ToastComponent, ToastCustomComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [ToastComponent],
})
export class ToastModule {}

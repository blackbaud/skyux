import { NgModule } from '@angular/core';
import { SkyToastModule } from '@skyux/toast';

import { ToastBodyComponent } from './toast-body.component';
import { ToastRoutingModule } from './toast-routing.module';
import { ToastComponent } from './toast.component';

@NgModule({
  declarations: [ToastComponent, ToastBodyComponent],
  imports: [ToastRoutingModule, SkyToastModule],
})
export class ToastModule {
  public static routes = ToastRoutingModule.routes;
}

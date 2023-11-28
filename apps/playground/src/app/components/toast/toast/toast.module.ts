import { NgModule } from '@angular/core';

import { ToastRoutingModule } from './toast-routing.module';
import { ToastComponent } from './toast.component';

@NgModule({
  declarations: [ToastComponent],
  imports: [ToastRoutingModule],
})
export class ToastModule {
  public static routes = ToastRoutingModule.routes;
}

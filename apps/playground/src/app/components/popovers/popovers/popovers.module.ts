import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PopoversRoutingModule } from './popovers-routing.module';
import { PopoversComponent } from './popovers.component';

@NgModule({
  imports: [CommonModule, PopoversRoutingModule, PopoversComponent],
})
export class PopoversModule {
  public static routes = PopoversRoutingModule.routes;
}

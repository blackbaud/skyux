import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { VerticalTabsetRoutingModule } from './vertical-tabset-routing.module';
import { VerticalTabsetComponent } from './vertical-tabset.component';

@NgModule({
  declarations: [VerticalTabsetComponent],
  imports: [CommonModule, SkyVerticalTabsetModule, VerticalTabsetRoutingModule],
})
export class VerticalTabsetModule {
  public static routes = VerticalTabsetRoutingModule.routes;
}
